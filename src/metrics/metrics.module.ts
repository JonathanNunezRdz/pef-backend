import { Global, Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Global()
@Module({
	providers: [MetricsService],
})
export class MetricsModule {}
