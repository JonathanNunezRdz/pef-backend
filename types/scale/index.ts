import { Prisma } from '@prisma/client';

export const prismaScaleSelect = Prisma.validator<Prisma.AlgorithmScaleArgs>()({
	select: {
		id: true,
		upperLimit: true,
		level: true,
		extra: true,
	},
});

export type PrismaScale = Prisma.AlgorithmScaleGetPayload<
	typeof prismaScaleSelect
>;

export const prismaScaleFindManyInput =
	Prisma.validator<Prisma.AlgorithmScaleFindManyArgs>()({
		select: prismaScaleSelect.select,
		orderBy: {
			upperLimit: 'desc',
		},
	});
