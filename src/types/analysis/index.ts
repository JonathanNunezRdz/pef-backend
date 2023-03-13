import { Prisma } from '@prisma/client';
import { prismaScaleFindManyInput } from '..';

export * from './analysis.response';
export * from './post-analysis.dto';

export const prismaAlgorithmFindManySelect =
	Prisma.validator<Prisma.AlgorithmArgs>()({
		select: {
			id: true,
			name: true,
			formula: true,
			max: true,
			min: true,
			unit: true,
			variables: {
				select: {
					variable: {
						select: {
							name: true,
						},
					},
				},
			},
			scales: prismaScaleFindManyInput,
		},
	});

export type PrismaAlgorithmResponse = Prisma.AlgorithmGetPayload<
	typeof prismaAlgorithmFindManySelect
>;
