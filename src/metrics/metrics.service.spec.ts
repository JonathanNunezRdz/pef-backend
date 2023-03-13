import { Metrics } from '@customTypes';
import { Test, TestingModule } from '@nestjs/testing';
import { TEST_TEXT } from '@src/analysis/analysis.service';
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
		expect(numOfLetters).toEqual(189);
	});

	it('should count all syllables', () => {
		const initialLength = TEST_TEXT.length;
		const syllables = service.countAllSyllables(TEST_TEXT);
		expect(syllables.length).toBeLessThanOrEqual(initialLength);
	});
});
