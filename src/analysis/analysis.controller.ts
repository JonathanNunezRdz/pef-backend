import {
	Body,
	Controller,
	FileTypeValidator,
	ParseFilePipe,
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
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType: /(application\/pdf|text\/plain)/,
					}),
				],
			})
		)
		file: Express.Multer.File
	) {
		return this.analysisService.postAnalysisWithFile({
			document: file,
			numOfSamples: postDto.numOfSamples || 5,
		});
	}
}
