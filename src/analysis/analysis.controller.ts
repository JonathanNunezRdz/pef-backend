import {
	Body,
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import {
	PostAnalysisDto,
	PostAnalysisResponse,
	PostAnalysisWithFileDto,
} from '@src/types';

import { FileInterceptor } from '@nestjs/platform-express';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisControler {
	constructor(private analysisService: AnalysisService) {}

	@Post('')
	postAnalysis(@Body() dto: PostAnalysisDto): Promise<PostAnalysisResponse> {
		return this.analysisService.postAnalysis(dto);
	}

	@Post('file')
	@UseInterceptors(FileInterceptor('file'))
	postAnalysisWithFile(
		@Body() postDto: PostAnalysisWithFileDto,
		@UploadedFile() file: Express.Multer.File
	) {
		return this.analysisService.postAnalysisWithFile({
			document: file,
			numOfSamples: postDto.numOfSamples || 5,
		});
	}
}
