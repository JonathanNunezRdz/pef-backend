import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
	DeleteResultService,
	PatchResultResponse,
	PatchResultService,
} from '@src/types';

@Injectable()
export class ResultService {
	constructor(private prisma: PrismaService) {}

	// get services

	// post services

	// patch services

	async editResult(dto: PatchResultService): Promise<PatchResultResponse> {
		const { description, userId, resultId } = dto;

		const rawResult = await this.prisma.analysisResult.findUnique({
			where: {
				id: resultId,
			},
			select: {
				id: true,
				userId: true,
			},
		});

		if (!rawResult || rawResult.userId !== userId)
			throw new ForbiddenException('No esta permitido esta acción');

		await this.prisma.analysisResult.update({
			where: {
				id: resultId,
			},
			data: {
				description,
			},
		});

		return {
			id: resultId,
			description,
		};
	}

	// delete services

	async deleteResult(dto: DeleteResultService) {
		const { resultId, userId } = dto;

		const deleteResult = await this.prisma.analysisResult.findUnique({
			where: {
				id: resultId,
			},
			select: {
				id: true,
				userId: true,
			},
		});

		if (!deleteResult || deleteResult.userId !== userId)
			throw new ForbiddenException('No esta permitido esta acción');

		await this.prisma.analysisResult.delete({
			where: {
				id: resultId,
			},
		});
	}
}
