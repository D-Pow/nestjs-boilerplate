import { Test, type TestingModule } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/app.module';

import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';


describe('AppController (e2e)', () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [ AppModule ],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it('GET /', async () => {
		/*
		 * Using supertest `request` means we don't have to `app.listen()` on a port.
		 * This also means we can't `fetch()` the endpoint and must call it through their API.
		 * Note: The supertest `Test` object from `request()` must be returned, otherwise nested
		 * `expect()` calls won't run.
		 */
		return request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect(res => { // Can only do partial matches with `res` object
				expect(res.body).toEqual(expect.objectContaining({
					pid: expect.anything(),
					message: 'Hello from a clustered NestJS worker',
				}));
			});
	});
});
