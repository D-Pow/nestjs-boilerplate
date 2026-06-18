import { Controller, Get, Module } from '@nestjs/common';

@Controller()
class AppController {
  @Get()
  hello(): { pid: number; message: string } {
    // Returning the PID makes it easy to see requests being spread across workers:
    // hit the endpoint a few times and watch the pid change.
    return { pid: process.pid, message: 'Hello from a clustered NestJS worker' };
  }
}

@Module({
  controllers: [AppController],
})
export class AppModule {}
