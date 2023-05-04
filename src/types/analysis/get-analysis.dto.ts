import { User } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetAnalysisDto {
	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Min(1)
	page: number;

	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Max(20)
	@Min(1)
	limit: number;
}

export interface GetAnalysisService extends GetAnalysisDto {
	id: User['id'];
}
