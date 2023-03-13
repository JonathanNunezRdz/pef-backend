import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/prisma/prisma.service';
import { UtilService } from '@src/util/util.service';
import { AnalysisService } from './analysis.service';

describe('AnalysisService', () => {
	let service: AnalysisService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UtilService,
				AnalysisService,
				ConfigService,
				PrismaService,
			],
		}).compile();

		service = module.get<AnalysisService>(AnalysisService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// describe('check text', () => {
	// 	it('should count letters only', () => {
	// 		const metrics = service.getMetrics(TEST_TEXT);
	// 		console.log(metrics);

	// 		expect(metrics.numOfLetters).toBeGreaterThan(0);
	// 	});
	// 	// it('should count words', () => {
	// 	// 	const metrics = service.textAnalyzer(TEST_TEXT);
	// 	// 	expect(metrics.numOfWords).toBeGreaterThan(0);
	// 	// });
	// });
});
