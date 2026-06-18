import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.ts';
import { AppService } from './app.service.ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Let in-flight requests finish before the process exits on SIGTERM/SIGINT.
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`[worker ${process.pid}] listening on :${port}`);
}

// Instead of calling bootstrap() directly, hand it to the cluster service.
// In the primary process this forks workers; in each worker it runs bootstrap().
AppService.run(bootstrap);
