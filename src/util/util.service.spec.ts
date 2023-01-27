import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
	let service: UtilService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ConfigService, UtilService],
		}).compile();

		service = module.get<UtilService>(UtilService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
