import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { evaluate } from 'mathjs';
import { PrismaService } from 'src/prisma/prisma.service';
import {
	BaseAlgorithm,
	Metrics,
	prismaAlgorithmFindManySelect,
	PrismaScale,
} from 'types';
import { v4 } from 'uuid';
import { UtilService } from '../util/util.service';

@Injectable()
export class AnalysisService {
	constructor(
		private utilService: UtilService,
		private prismaService: PrismaService
	) {}

	// post services

	async postAnalysis(rawText: string) {
		const metrics = this.getMetrics(rawText);

		console.log('metrics:', metrics);

		const algorithms = await this.prismaService.algorithm.findMany({
			select: prismaAlgorithmFindManySelect.select,
		});

		const scores: BaseAlgorithm[] = algorithms.map((algorithm) => {
			const formula = algorithm.formula;
			const variables = algorithm.variables.reduce((acc, current) => {
				return {
					...acc,
					[current]: metrics[current],
				};
			}, {});

			const value = evaluate(formula, variables);

			// TODO: get scale range that the score fits in

			return {
				id: algorithm.id,
				name: algorithm.name,
				unit: algorithm.unit,
				min: algorithm.min,
				max: algorithm.max,
				score: {
					value,
					// INCOMPLETE
				},
			};
		});

		// const scores = this.textAnalyzer(rawText);

		return {
			id: v4(),
			createdAt: new Date(),
			updatedAt: new Date(),
			scores,
		};
	}

	// Helper services

	getMetrics(text: string): Metrics {
		// save text to file so python can use the text
		const file = this.utilService.writeFile(text);
		// call python script to get metrics
		const metrics = this.utilService.spawnPython<Metrics>(file);
		// remove file
		return metrics;
	}

	getDifficulty(
		scale: PrismaScale[],
		score: number
	): Pick<PrismaScale, 'level' | 'extra'> {
		for (let i = 0; i < scale.length; i++) {
			if (score < scale[i].upperLimit) {
				return {
					level: scale[i].level,
					extra: scale[i].extra,
				};
			}
		}
		throw new InternalServerErrorException('score out of bounds');
	}

	normalizeScore(score: number) {
		const scoreNum = Math.min(score, 100);
		return Math.max(0, scoreNum);
	}
}

export const TEST_TEXT = `Vivo en una casa pequeña 
pero moderna en el centro 
de la ciudad? Mi casa 
tiene dos habitaciones, 
un baño, una sala de estar, 
una cocina y una pequeña 
terraza. Por las tardes el 
sol calienta la casa durante 
horas, así que no suele 
hacer frío.`;

/**
 * total de letras = 189
 * total de silabas = 85
 * total de palabras = 46
 * total de oraciones = 3
 * 13
 * 17
 * 16
 */

/**
 * Formulas
-> huerta
    -> L = 206.84 - 0.60P - 1.02F
    -> P = promedio de silabas por palabra
    -> F = media de palabras por frase
-> polini
    -> C = 95.2 - (9.7L / P) - (0.35P / F)
    -> L = numero de letras
    -> P = numero de palabras
    -> F = numero de frases
-> crawford
    -> A = -0.205OP + 0.049SP - 3.047
    -> OP = numero de oraciones por cien palabras
    -> SP = numero de silabas por cien palabras
-> pazos
    -> P = 206.835 - (62.3S / P) - (P / F)
    -> S = total de silabas
    -> P = cantidad de palabras
    -> F = numero de frases
-> barrio
    -> igual que pazos
-> miu
    -> u = (n / (n - 1)) (x / v) * 100
    -> n = numero de palabras
    -> x = media de letras por palabra
    -> v = varianza de letras por palabras
 */
