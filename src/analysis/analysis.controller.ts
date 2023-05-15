import {
	Body,
	Controller,
	FileTypeValidator,
	Get,
	ParseFilePipe,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import {
	GetAnalysisDto,
	GetAnalysisResponse,
	PostAnalysisDto,
	PostAnalysisResponse,
	PostAnalysisWithFileDto,
	PostAnalysisWithUrlDto,
} from '@src/types';

import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { GetUser } from '@src/auth/decorator';
import { JwtGuard } from '@src/auth/guard';
import { AnalysisService } from './analysis.service';

const mimeTypeRegexp =
	/(application\/pdf|text\/plain|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/;

@Controller('analysis')
export class AnalysisControler {
	constructor(private analysisService: AnalysisService) {}

	// get routes

	@UseGuards(JwtGuard)
	@Get('')
	getAnalysis(
		@Query() dto: GetAnalysisDto,
		@GetUser('id') userId: User['id']
	): Promise<GetAnalysisResponse> {
		return this.analysisService.getAnalysis({ id: userId, ...dto });
	}

	// post routes

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
						fileType: mimeTypeRegexp,
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

	// put/patch routes

	// delete routes
}
