import { Module } from '@nestjs/common';
import { AlgorithmController } from './algorithm.controller';
import { AlgorithmService } from './algorithm.service';

@Module({
	controllers: [AlgorithmController],
	providers: [AlgorithmService],
})
export class AlgorithmModule {}
