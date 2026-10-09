import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import type { SampleEntry, SampleLogicInput, SampleLogicOutput } from '@/app.service';

export class SamplePostEntryDto implements SampleEntry {
	@ApiProperty()
	@IsNumber()
	id!: number;

	@ApiProperty()
	@IsString()
	name!: string;

	constructor(args?: typeof this) {
		Object.assign(this, args);
	}
}

export class SamplePostInputDto implements SampleLogicInput {
	@ApiProperty()
	@IsString()
	description!: string;

	@ApiProperty({
		required: false,
		type: [ SamplePostEntryDto ],
	})
	@Type(() => SamplePostEntryDto)
	entries?: SamplePostEntryDto[];

	constructor(args?: SamplePostInputDto) {
		Object.assign(this, args);
	}
}

export class SamplePostOutputDto implements SampleLogicOutput {
	@ApiProperty()
	@IsString()
	description!: string;

	@ApiPropertyOptional({
		type: [ SamplePostEntryDto ],
	})
	@IsArray()
	entries?: Array<SampleEntry>;

	@ApiProperty()
	@IsNumber()
	total!: number;

	constructor(args?: SamplePostInputDto) {
		Object.assign(this, args);
	}
}
