import { Module } from '@nestjs/common';
import { AnalysisControler } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
	controllers: [AnalysisControler],
	providers: [AnalysisService],
})
export class AnalysisModule {}
