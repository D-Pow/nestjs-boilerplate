import cluster from 'node:cluster';
import * as os from 'node:os';

/**
 * Wraps Node's cluster module so a NestJS app can fork one worker per CPU core.
 *
 * The PRIMARY process forks workers and supervises them (restarting any that die).
 * Each WORKER process runs the actual Nest HTTP server. The OS kernel load-balances
 * incoming TCP connections across workers listening on the same port, so you get
 * parallelism across cores — the practical equivalent of Tomcat saturating a thread
 * pool, but as processes rather than threads.
 */
export class AppService {
  // Allow overriding worker count via env (e.g. in containers with limited CPU quota).
  private static readonly workerCount =
    Number(process.env.WEB_CONCURRENCY) || os.cpus().length;

  static run(bootstrap: () => Promise<void>): void {
    if (cluster.isPrimary) {
      console.log(`[primary ${process.pid}] starting ${this.workerCount} workers`);

      for (let i = 0; i < this.workerCount; i++) {
        cluster.fork();
      }

      // Respawn a worker if it crashes so capacity is restored automatically.
      cluster.on('exit', (worker, code, signal) => {
        console.warn(
          `[primary] worker ${worker.process.pid} died (code=${code}, signal=${signal}); forking a replacement`,
        );
        cluster.fork();
      });
    } else {
      // We're inside a worker — actually boot the Nest application.
      bootstrap();
    }
  }
}
