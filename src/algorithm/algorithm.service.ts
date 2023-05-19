import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class AlgorithmService {
	constructor(private prisma: PrismaService) {}

	async getAlgorithms() {
		const algorithms = await this.prisma.algorithm.findMany({
			select: {
				id: true,
				name: true,
				scales: {
					select: {
						id: true,
						level: true,
						upperLimit: true,
						extra: true,
					},
				},
			},
		});

		return algorithms;
	}
}
