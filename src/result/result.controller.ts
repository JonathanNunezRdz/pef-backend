import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { AnalysisResult, User } from '@prisma/client';
import { GetUser } from '@src/auth/decorator';
import { JwtGuard } from '@src/auth/guard';
import { PatchResultDto, PatchResultResponse } from '@src/types';
import { ResultService } from './result.service';

@UseGuards(JwtGuard)
@Controller('result')
export class ResultController {
	constructor(private readonly resultService: ResultService) {}

	// get routes

	// post routes

	// patch/put routes

	@Patch(':id')
	editResult(
		@GetUser('id') userId: User['id'],
		@Param('id') id: AnalysisResult['id'],
		@Body() dto: PatchResultDto
	): Promise<PatchResultResponse> {
		return this.resultService.editResult({
			userId,
			resultId: id,
			description: dto.description,
		});
	}

	// delete routes

	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	deleteResult(
		@GetUser('id') userId: User['id'],
		@Param('id') resultId: AnalysisResult['id']
	) {
		return this.resultService.deleteResult({ userId, resultId });
	}
}
