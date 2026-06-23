import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello() {
		return { pid: process.pid, message: 'Hello from a clustered NestJS worker' };
	}
}
