import { Controller, Get } from '@nestjs/common';
import { AnalysisService, TEST_TEXT } from './analysis.service';

@Controller('analysis')
export class AnalysisControler {
	constructor(private analysisService: AnalysisService) {}

	@Get('')
	getAnalysis() {
		return this.analysisService.getMetrics(TEST_TEXT);
	}
}
