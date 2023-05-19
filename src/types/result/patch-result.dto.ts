import { AnalysisResult, User } from '@prisma/client';
import { IsString } from 'class-validator';

export class PatchResultDto {
	@IsString()
	description: string;
}

export interface PatchResultService extends PatchResultDto {
	userId: User['id'];
	resultId: AnalysisResult['id'];
}
