import { Test, TestingModule } from '@nestjs/testing';
import { TEST_TEXT } from '@src/analysis/analysis.service';
import { Metrics } from '@src/types';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
	let service: MetricsService;
	let metrics: Partial<Metrics>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MetricsService],
		}).compile();

		service = module.get<MetricsService>(MetricsService);
		metrics = service.getMetrics(TEST_TEXT);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should count letters', () => {
		const { numOfLetters } = metrics;
		expect(numOfLetters).toEqual(212);
	});

	it('should count all syllables', () => {
		const { numOfSyllables } = metrics;
		expect(numOfSyllables).toEqual(93);
	});
});
