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
	PostAnalysisWithUrlDto,
} from '@src/types';

import { FileInterceptor } from '@nestjs/platform-express';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisControler {
	constructor(private analysisService: AnalysisService) {}

	@Post('')
	postAnalysis(@Body() dto: PostAnalysisDto): Promise<PostAnalysisResponse> {
		return this.analysisService.postAnalysis({
			text: dto.text,
			numOfSamples: dto.numOfSamples || 5,
		});
	}

	@Post('file')
	@UseInterceptors(FileInterceptor('document'))
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
		document: Express.Multer.File
	) {
		return this.analysisService.postAnalysisWithFile({
			document,
			numOfSamples: postDto.numOfSamples || 5,
		});
	}

	@Post('url')
	postAnalysisWithUrl(@Body() dto: PostAnalysisWithUrlDto): Promise<any> {
		return this.analysisService.postAnalysisWithUrl({
			url: dto.url,
			numOfSamples: dto.numOfSamples || 5,
		});
	}
}
