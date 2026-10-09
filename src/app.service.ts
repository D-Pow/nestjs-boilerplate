import { Injectable } from '@nestjs/common';

export interface SampleEntry {
	id: number;
	name: string;
}

export interface SampleLogicInput {
	description: string;
	entries?: Array<SampleEntry>;
}

export interface SampleLogicOutput extends SampleLogicInput {
	total: number;
}

@Injectable()
export class AppService {
	getHello() {
		return { pid: process.pid, message: 'Hello from a clustered NestJS worker' };
	}

	sampleLogic({ description, entries }: SampleLogicInput) {
		return {
			description,
			entries,
			total: entries?.length ?? 0,
		} as SampleLogicOutput;
	}
}
