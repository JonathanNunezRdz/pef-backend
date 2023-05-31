import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/prisma/prisma.service';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

describe('ResultController', () => {
	let controller: ResultController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ResultController],
			providers: [ConfigService, PrismaService, ResultService],
		}).compile();

		controller = module.get<ResultController>(ResultController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
