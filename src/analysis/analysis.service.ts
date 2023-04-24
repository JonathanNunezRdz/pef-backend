import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotAcceptableException,
} from '@nestjs/common';
import { convert } from 'html-to-text';
import { evaluate } from 'mathjs';
import pdf from 'pdf-parse';
import { v4 } from 'uuid';
import WordExtractor from 'word-extractor';

import { MetricsService } from '@src/metrics/metrics.service';
import { PrismaService } from '@src/prisma/prisma.service';
import {
	BaseAlgorithmScore,
	Metrics,
	PostAnalysisResponse,
	PostAnalysisService,
	PostAnalysisWithFileService,
	PostAnalysisWithUrlDto,
	PrismaScale,
	ScoreExtra,
	prismaAlgorithmFindManySelect,
} from '@src/types';
import { UtilService } from '../util/util.service';

@Injectable()
export class AnalysisService {
	constructor(
		private utilService: UtilService,
		private prismaService: PrismaService,
		private metricsService: MetricsService
	) {}

	async postAnalysisWithUrl(dto: PostAnalysisWithUrlDto) {
		if (!this.utilService.validateUrl(dto.url))
			throw new BadRequestException('URL no válido');

		// extract content from url
		console.log(dto.url);

		const res = await fetch(dto.url, {
			method: 'GET',
		});
		const page = await res.text();
		const parsedText = convert(page, {
			selectors: [{ selector: 'a', options: { ignoreHref: true } }],
		});
		console.log(parsedText);
		return this.postAnalysis({
			text: parsedText,
			numOfSamples: dto.numOfSamples || 5,
		});
	}

	async postAnalysisWithFile(dto: PostAnalysisWithFileService) {
		const { document, numOfSamples } = dto;
		let text: string;
		if (document.mimetype === 'application/pdf') {
			const result = await pdf(document.buffer);
			text = result.text;
		} else if (document.mimetype === 'text/plain') {
			text = document.buffer.toString();
		} else if (
			/(application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/.test(
				document.mimetype
			)
		) {
			// extract contents from doc with node-extractor
			const extractor = new WordExtractor();
			const parsedDocument = await extractor.extract(document.buffer);
			text = parsedDocument.getBody();
		} else {
			throw new NotAcceptableException('file format not supported');
		}

		return this.postAnalysis({ text, numOfSamples });
	}

	// post services

	async postAnalysis(
		dto: PostAnalysisService
	): Promise<PostAnalysisResponse> {
		// if (franc.franc(dto.text) !== 'spa')
		// 	throw new BadRequestException('este lenguage no es espanol');

		const metrics = this.metricsService.getMetrics(dto);

		const algorithms = await this.prismaService.algorithm.findMany({
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

		return {
			id: v4(),
			createdAt: new Date(),
			updatedAt: new Date(),
			scores,
			metrics,
		};
	}

	// Helper services

	getMetrics(text: string): Metrics {
		const file = this.utilService.writeFile(text);
		const metrics = this.utilService.spawnPython<Metrics>(file);
		this.utilService.deleteFile(file);
		return metrics;
	}

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

	normalizeScore(score: number) {
		const scoreNum = Math.min(score, 100);
		return Math.max(0, scoreNum);
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
