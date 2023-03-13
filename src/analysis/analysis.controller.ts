import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostAnalysisDto, PostAnalysisResponse } from '@src/types';

import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisControler {
	constructor(private analysisService: AnalysisService) {}

	@Post('')
	postAnalysis(@Body() dto: PostAnalysisDto): Promise<PostAnalysisResponse> {
		return this.analysisService.postAnalysis(dto);
	}

	@Get('test')
	testMetrics() {
		return this.analysisService.nativeGetMetrics();
	}
}
