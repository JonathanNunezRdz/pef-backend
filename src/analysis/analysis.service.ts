import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { evaluate } from 'mathjs';
import { v4 } from 'uuid';

import { Prisma } from '@prisma/client';
import { MetricsService } from '@src/metrics/metrics.service';
import { PrismaService } from '@src/prisma/prisma.service';
import {
	BaseAlgorithmScore,
	GetAnalysisResponse,
	GetAnalysisService,
	PostAnalysisResponse,
	PostAnalysisService,
	PostAnalysisWithFileService,
	PostAnalysisWithUrlService,
	PrismaScale,
	ResponseVariable,
	SaveAnalysisResponse,
	SaveAnalysisService,
	SaveAnalysisWithFileService,
	SaveAnalysisWithUrlService,
	ScoreExtra,
	prismaAlgorithmFindManySelect,
	prismaScaleSelect,
} from '@src/types';
import { UtilService } from '../util/util.service';

const pointsPerDificulty: Record<string, number> = {
	'Muy fácil': 10,
	Fácil: 9,
	'Bastante fácil': 8,
	'Un poco fácil': 7,
	'Moderadamente fácil': 7,
	Normal: 6,
	Adecuado: 6,
	'Un poco difícil': 5,
	'Algo difícil': 4,
	'Moderadamente difícil': 4,
	Árido: 3,
	'Bastante difícil': 3,
	Difícil: 2,
	'Muy difícil': 1,
};

const algorithmWeights: Record<
	string,
	{ lessThanHundredWords: number; moreThanHundredWords: number }
> = {
	'Fernández Huerta': {
		lessThanHundredWords: 2,
		moreThanHundredWords: 3.5,
	},
	'Gutiérrez de Polini': {
		lessThanHundredWords: 1,
		moreThanHundredWords: 1,
	},
	'Szigriszt-Pazos': {
		lessThanHundredWords: 2.5,
		moreThanHundredWords: 2,
	},
	Inflesz: {
		lessThanHundredWords: 3,
		moreThanHundredWords: 2.5,
	},
	'Legibilidad μ': {
		lessThanHundredWords: 2,
		moreThanHundredWords: 1,
	},
};

@Injectable()
export class AnalysisService {
	constructor(
		private util: UtilService,
		private prisma: PrismaService,
		private metrics: MetricsService
	) {}

	// get services

	async getAnalysis(dto: GetAnalysisService): Promise<GetAnalysisResponse> {
		const { id, page, limit } = dto;
		const totalAnalysis = await this.prisma.analysisResult.count({
			where: {
				user: {
					id,
				},
			},
		});

		const rawAnalysis = await this.prisma.analysisResult.findMany({
			where: {
				user: {
					id,
				},
			},
			select: {
				id: true,
				createdAt: true,
				description: true,
				scores: {
					select: {
						id: true,
						dificulty: true,
						value: true,
						algorithm: {
							select: {
								name: true,
								unit: true,
								max: true,
							},
						},
					},
				},
			},
			take: limit,
			skip: (page - 1) * limit,
			orderBy: {
				createdAt: 'desc',
			},
		});

		return {
			data: rawAnalysis,
			totalAnalysis,
		};
	}

	// post services

	async postAnalysisWithUrl(
		dto: PostAnalysisWithUrlService
	): Promise<PostAnalysisResponse> {
		const { url, numOfSamples } = dto;
		const text = await this.util.extractTextFromUrl(url);
		return this.postAnalysis({
			text,
			numOfSamples,
		});
	}

	async saveAnalysisWithUrl(
		dto: SaveAnalysisWithUrlService
	): Promise<SaveAnalysisResponse> {
		const { userId, postDto } = dto;
		let { description } = dto;

		const text = await this.util.extractTextFromUrl(postDto.url);

		if (!description) description = `${text.slice(0, 20)}...`;

		const analysis = await this.postAnalysis({
			numOfSamples: postDto.numOfSamples,
			text,
		});

		const prismaScores: Prisma.ScoreCreateManyAnalysisResultInput[] =
			analysis.scores.map<Prisma.ScoreCreateManyAnalysisResultInput>(
				(score) => {
					return {
						value: score.score.value,
						dificulty: score.score.level,
						algorithmId: score.id,
					};
				}
			);

		const savedAnalysis = await this.prisma.analysisResult.create({
			data: {
				description,
				scores: {
					createMany: {
						data: prismaScores,
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		return { ...analysis, id: savedAnalysis.id, description };
	}

	async postAnalysisWithFile(dto: PostAnalysisWithFileService) {
		const { document, numOfSamples } = dto;
		const text = await this.util.extractTextFromFile(document);
		return this.postAnalysis({ text, numOfSamples });
	}

	async saveAnalysisWithFile(
		dto: SaveAnalysisWithFileService
	): Promise<SaveAnalysisResponse> {
		const { userId, postDto } = dto;
		let { description } = dto;

		const text = await this.util.extractTextFromFile(postDto.document);

		if (!description) description = `${text.slice(0, 20)}...`;

		const analysis = await this.postAnalysis({
			numOfSamples: postDto.numOfSamples,
			text,
		});

		const prismaScores: Prisma.ScoreCreateManyAnalysisResultInput[] =
			analysis.scores.map<Prisma.ScoreCreateManyAnalysisResultInput>(
				(score) => {
					return {
						value: score.score.value,
						dificulty: score.score.level,
						algorithmId: score.id,
					};
				}
			);

		const savedAnalysis = await this.prisma.analysisResult.create({
			data: {
				description,
				scores: {
					createMany: {
						data: prismaScores,
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		return { ...analysis, id: savedAnalysis.id, description };
	}

	async postAnalysis(
		dto: PostAnalysisService
	): Promise<PostAnalysisResponse> {
		// future feature -> detect is text is in spanish

		const metrics = this.metrics.getMetrics(dto);
		const metricNames = await this.prisma.variable.findMany();
		const algorithms = await this.prisma.algorithm.findMany({
			where: {
				name: {
					not: 'UDEM',
				},
			},
			select: prismaAlgorithmFindManySelect.select,
		});

		const scores: BaseAlgorithmScore[] = algorithms.map((algorithm) => {
			const {
				formula,
				scales,
				variables: rawVariables,
				...rest
			} = algorithm;
			try {
				// can delete this and use the entire metrics object
				const variables = rawVariables
					.map((variable) => variable.variable.name)
					.reduce((prev, current) => {
						return {
							...prev,
							[current]: metrics[current],
						};
					}, {});

				let value = evaluate(formula, variables);
				value = Math.min(value, algorithm.max);
				value = Math.max(algorithm.min, value);
				const score = this.getAlgorithmScore(scales, value);

				return {
					...rest,
					score,
				};
			} catch (error) {
				console.error('algorithm:', algorithm.name);
				console.error('variables:', rawVariables);
				throw error;
			}
		});

		// aplicar algoritmo desarrollado aqui
		const newScores = scores
			.filter((score) => typeof score.score.level !== 'undefined')
			.reduce<{ [k: string]: number }>((prev, score) => {
				if (typeof score.score.level === 'undefined')
					throw new InternalServerErrorException(
						'Filtrado de puntajes fallido'
					);
				const newPoints = pointsPerDificulty[score.score.level];
				return {
					...prev,
					[score.name]: newPoints,
				};
			}, {});

		const applyAlgorithmUdem = () => {
			const key =
				metrics.numOfWords >= 100
					? 'moreThanHundredWords'
					: 'lessThanHundredWords';
			let acc = 0;
			Object.entries(newScores).forEach(([algorithm, points]) => {
				acc += points * algorithmWeights[algorithm][key];
			});
			return acc;
		};

		const algorithmUdemData = await this.prisma.algorithm.findFirst({
			where: {
				name: 'UDEM',
			},
			select: {
				id: true,
				name: true,
				max: true,
				min: true,
				unit: true,
				scales: prismaScaleSelect,
			},
		});

		if (!algorithmUdemData)
			throw new InternalServerErrorException(
				'Algoritmo UDEM no encontrado'
			);

		const { scales, ...rest } = algorithmUdemData;
		const algorithmUdem: BaseAlgorithmScore = {
			...rest,
			score: this.getAlgorithmScore(scales, applyAlgorithmUdem()),
		};

		const newMetrics = Object.entries(metrics).map<ResponseVariable>(
			(pair) => {
				const readableName = metricNames.find(
					(metric) => metric.name === pair[0]
				);
				if (typeof readableName === 'undefined')
					throw new InternalServerErrorException(
						'el nombre de la métrica no existe'
					);
				return {
					readableName: readableName.readableName,
					value: pair[1],
					name: pair[0],
				};
			}
		);

		const result = {
			id: v4(),
			createdAt: new Date(),
			updatedAt: new Date(),
			scores: [algorithmUdem, ...scores],
			metrics: newMetrics,
		};

		return result;
	}

	async saveAnalysis(
		dto: SaveAnalysisService
	): Promise<SaveAnalysisResponse> {
		const { userId, postDto } = dto;
		let { description } = dto;
		if (!description) description = `${postDto.text.slice(0, 20)}...`;

		const analysis = await this.postAnalysis(postDto);

		const prismaScores: Prisma.ScoreCreateManyAnalysisResultInput[] =
			analysis.scores.map<Prisma.ScoreCreateManyAnalysisResultInput>(
				(score) => {
					return {
						value: score.score.value,
						dificulty: score.score.level,
						algorithmId: score.id,
					};
				}
			);

		const savedAnalysis = await this.prisma.analysisResult.create({
			data: {
				description,
				scores: {
					createMany: {
						data: prismaScores,
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		return { ...analysis, id: savedAnalysis.id, description };
	}

	// Helper services

	getAlgorithmScore(
		scales: PrismaScale[],
		value: number
	): BaseAlgorithmScore['score'] {
		if (scales.length === 0) {
			return {
				value,
			};
		}
		for (let i = 0; i < scales.length; i++) {
			if (value <= scales[i].upperLimit) {
				if (scales[i].extra) {
					const extra = scales[i].extra as ScoreExtra;
					return {
						value,
						level: scales[i].level,
						extra,
					};
				}
				return {
					value,
					level: scales[i].level,
				};
			}
		}
		throw new InternalServerErrorException(
			`score out of bounds ${JSON.stringify(scales)}\n\nwith ${value}`
		);
	}
}

// function isSpanish(text: string): boolean {
// 	const spanishRegex = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+/g;
// 	const matches = text.match(spanishRegex);
// 	if (matches === null) {
// 		return false;
// 	}
// 	const numWords = matches.length;
// 	const numSpanishWords = matches.filter((word) =>
// 		/[áéíóúÁÉÍÓÚñÑüÜ]/.test(word)
// 	).length;
// 	const percentSpanishWords = numSpanishWords / numWords;
// 	return percentSpanishWords >= 0.2;
// }

export const TEST_TEXT = `Tengo 23 años viviendo en una casa pequeña pero moderna en el centro de la ciudad. Mi casa tiene dos habitaciones, un baño, una sala de estar, una cocina y una pequeña terraza. Por las tardes el sol calienta la casa durante horas, así que no suele hacer frío.`;

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
