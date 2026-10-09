import os from 'node:os';
import cluster from 'node:cluster';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from '@/app.module';

const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = process.env.PORT ?? 8000;

	app.enableShutdownHooks(); // Let in-flight requests finish before the process exits on SIGTERM/SIGINT.
	app.useGlobalPipes(new ValidationPipe({ // Transform endpoint input data to the correct TS types.
		transform: true,
		transformOptions: {
			enableImplicitConversion: true, // Cast vars that behave like others (e.g. '1' => 1)
			enableCircularCheck: true,
		},
		enableDebugMessages: !isProd,
	}));

	await app.listen(port);

	console.log(`[worker ${process.pid}] listening on :${port}`);
}

/**
 * Wraps Node's cluster module so a NestJS app can fork one worker per CPU core.
 *
 * The PRIMARY process forks workers and supervises them (restarting any that die).
 * Each WORKER process runs the actual Nest HTTP server. The OS kernel load-balances
 * incoming TCP connections across workers listening on the same port, so you get
 * parallelism across cores — the practical equivalent of Tomcat saturating a thread
 * pool, but as processes rather than threads.
 */
async function clusteredBootstrap() {
	const workerCount = (
		Number(process.env.NUM_PROCS)
		|| (os.cpus().length - 1) // Leave 1 CPU for other non-node processes
	);

	if (cluster.isPrimary) {
		console.log(`[primary ${process.pid}] starting ${workerCount} workers`);

		for (let i = 0; i < workerCount; i++) {
			cluster.fork();
		}

		// Respawn a worker if it crashes so capacity is restored automatically.
		cluster.on('exit', (worker, code, signal) => {
			console.warn(`[primary] worker ${worker.process.pid} died (code=${code}, signal=${signal}); forking a replacement`);

			cluster.fork();
		});
	} else {
		// We're inside a worker — actually boot the Nest application.
		bootstrap();
	}
}

if (process.env.CLUSTER === 'true') {
	clusteredBootstrap();
} else {
	bootstrap();
}
