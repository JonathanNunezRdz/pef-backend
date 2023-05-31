import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/prisma/prisma.service';
import { ResultService } from './result.service';

describe('ResultService', () => {
	let service: ResultService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ConfigService, PrismaService, ResultService],
		}).compile();

		service = module.get<ResultService>(ResultService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
