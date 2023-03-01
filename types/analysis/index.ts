import { Prisma } from '@prisma/client';
import { prismaScaleFindManyInput } from 'types/scale';

export const prismaAlgorithmFindManySelect =
	Prisma.validator<Prisma.AlgorithmArgs>()({
		select: {
			id: true,
			formula: true,
			variables: true,
			name: true,
			unit: true,
			min: true,
			max: true,
			scales: prismaScaleFindManyInput,
		},
	});

export type PrismaAlgorithmResponse = Prisma.AlgorithmGetPayload<
	typeof prismaAlgorithmFindManySelect
>;
