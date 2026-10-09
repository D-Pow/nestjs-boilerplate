import { Body, Controller, Get, Logger, Post } from '@nestjs/common';

import { ApiOkResponse } from '@nestjs/swagger';

import { AppService } from '@/app.service';
import { SamplePostInputDto, SamplePostOutputDto } from '@/dto/SamplePost.dto';

@Controller()
export class AppController {
	private logger = new Logger(this.constructor.name);

	constructor(private readonly appService: AppService) {}

	@Get()
	getHello() {
		return this.appService.getHello();
	}

	// Note: Requires `Content-Type: 'application/json'`
	@Post('sample')
	@ApiOkResponse({
		description: 'Sample POST endpoint',
		type: SamplePostOutputDto,
	})
	postSample(@Body() data: SamplePostInputDto) {
		this.logger.debug('Received POST data:', data);

		const sampleLogicOutput = this.appService.sampleLogic(data);

		return new SamplePostOutputDto(sampleLogicOutput);
	}
}
