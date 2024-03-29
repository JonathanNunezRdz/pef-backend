import { Controller, Get } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';

@Controller('algorithm')
export class AlgorithmController {
	constructor(private readonly algorithmService: AlgorithmService) {}

	@Get('')
	getAlgorithms() {
		return this.algorithmService.getAlgorithms();
	}
}
