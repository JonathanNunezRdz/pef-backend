import { Prisma } from '@prisma/client';

export const prismaAlgorithmVariableSelect =
	Prisma.validator<Prisma.Algorithm$variablesArgs>()({
		select: {
			variable: {
				select: {
					name: true,
				},
			},
		},
	});

export type PrismaVariable = Prisma.AlgorithmVariableGetPayload<
	typeof prismaAlgorithmVariableSelect
>;

export const prismaAlgorithmVariableFindManyInput =
	Prisma.validator<Prisma.AlgorithmVariableFindManyArgs>()({
		select: prismaAlgorithmVariableSelect.select,
	});

export type ResponseVariable = {
	name: string;
	readableName: string;
	value: number;
};
