import { Body, Controller, Post } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisControler {
	constructor(private analysisService: AnalysisService) {}

	@Post('')
	postAnalysis(@Body() { text }: { text: string }) {
		return this.analysisService.postAnalysis(text);
	}
}
