import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService, TEST_TEXT } from './analysis.service';

describe('AnalysisService', () => {
	let service: AnalysisService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AnalysisService],
		}).compile();

		service = module.get<AnalysisService>(AnalysisService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// const metrics = service.textAnalyzer(TEST_TEXT);

	describe('check text', () => {
		it('should count letters only', () => {
			const metrics = service.textAnalyzer(TEST_TEXT);
			console.log(metrics);

			expect(metrics.numOfLetters).toBeGreaterThan(0);
		});
		// it('should count words', () => {
		// 	const metrics = service.textAnalyzer(TEST_TEXT);
		// 	expect(metrics.numOfWords).toBeGreaterThan(0);
		// });
	});
});
