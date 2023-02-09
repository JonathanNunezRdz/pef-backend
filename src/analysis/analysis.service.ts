import { Injectable } from '@nestjs/common';
import { UtilService } from '../util/util.service';

export type Metrics = {
	numOfLetters: number;
	numOfSyllables: number;
	numOfWords: number;
	numOfSentences: number;
	avgLettersPerWord: number;
	avgSyllablePerWord: number;
	avgWordsPerSentence: number;
	avgSentencesPerHundredWords: number;
	avgSyllablesPerHundredWords: number;
	varLettersPerWord: number;
};

export type FernandezHuertaScore = Score & {
	difficulty: string;
	schoolGrade: string;
};

export type GutierrezPoliniScore = Score & {
	difficulty: string;
};

export type SzigrisztPazosScore = Score & {
	difficulty: string;
	type: string;
	schoolGrade: string;
};

export type InfleszScore = Score & {
	difficulty: string;
};

export type muScore = Score & {
	difficulty: string;
};

export type CrawfordScore = {
	years: number;
};

export type Score = {
	score: number;
};

export type AllScores = {
	fh: FernandezHuertaScore;
	gp: GutierrezPoliniScore;
	sp: SzigrisztPazosScore;
	c: CrawfordScore;
	i: InfleszScore;
	m: muScore;
};

@Injectable()
export class AnalysisService {
	constructor(private utilService: UtilService) {}

	// main services

	/**
	 * Main function that gets all the scores
	 * @param rawText text sent from client
	 * @returns object with all scores
	 *
	 * @example
	 *
	 * ```
	 * const scores = this.analysisService.textAnalizer(text)
	 * ```
	 */
	textAnalyzer(rawText: string): AllScores {
		const metrics = this.getMetrics(rawText);

		// call all algorithms
		const allScores: AllScores = {
			c: this.alCrawford(metrics),
			fh: this.alFH(metrics),
			gp: this.alGP(metrics),
			i: this.alInflesz(metrics),
			m: this.alMu(metrics),
			sp: this.alSP(metrics),
		};

		return allScores;
	}

	// Algorithm services

	alFH(metrics: Metrics): FernandezHuertaScore {
		const { avgSyllablePerWord, avgWordsPerSentence } = metrics;
		const rawScore =
			206.84 - 60 * avgSyllablePerWord - 1.02 * avgWordsPerSentence;
		const score = this.normalizeScore(rawScore);
		return {
			score,
			...this.getFHDifficulty(score),
		};
	}

	alGP(metrics: Metrics): GutierrezPoliniScore {
		const { numOfLetters, numOfWords, numOfSentences } = metrics;
		const rawScore =
			95.2 -
			9.7 * (numOfLetters / numOfWords) -
			0.35 * (numOfWords / numOfSentences);
		const score = this.normalizeScore(rawScore);
		return {
			score,
			...this.getGPDifficulty(score),
		};
	}

	alCrawford(metrics: Metrics): CrawfordScore {
		const { numOfSyllables, numOfWords, numOfSentences } = metrics;
		const SyPHW = (100 * numOfSyllables) / numOfWords;
		const SePHW = (100 * numOfSentences) / numOfWords;
		const rawScore = -0.205 * SePHW + 0.049 * SyPHW - 3.407;
		const years = Number(rawScore.toFixed(1));
		return {
			years,
		};
	}

	alSP(metrics: Metrics): SzigrisztPazosScore {
		const { numOfSyllables, numOfWords, numOfSentences } = metrics;
		const rawScore =
			206.835 -
			62.3 * (numOfSyllables / numOfWords) -
			numOfWords / numOfSentences;
		const score = this.normalizeScore(rawScore);
		return {
			score,
			...this.getSPDifficulty(score),
		};
	}

	alInflesz(metrics: Metrics): InfleszScore {
		const { numOfSyllables, numOfWords, numOfSentences } = metrics;
		let scoreNum =
			206.835 -
			62.3 * (numOfSyllables / numOfWords) -
			numOfWords / numOfSentences;
		scoreNum = Number(scoreNum.toFixed(2));
		return {
			score: scoreNum,
			...this.getINFDifficulty(scoreNum),
		};
	}

	// WIP
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	alMu(metrics: Metrics): muScore {
		return {
			score: 0,
			difficulty: '',
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

	getFHDifficulty(
		score: number
	): Pick<FernandezHuertaScore, 'difficulty' | 'schoolGrade'> {
		if (score < 30)
			return {
				difficulty: 'Muy dificil',
				schoolGrade: 'Universitario (especialización)',
			};
		if (score >= 30 && score < 50)
			return { difficulty: 'Difícil', schoolGrade: 'Cursos selectivos' };
		if (score >= 50 && score < 60)
			return {
				difficulty: 'Moderadamente difícil',
				schoolGrade: 'Cursos selectivos',
			};
		if (score >= 60 && score < 70)
			return {
				difficulty: 'Normal',
				schoolGrade: '7° u 8° grado selectivos',
			};
		if (score >= 70 && score < 80)
			return {
				difficulty: 'Moderadamente fácil',
				schoolGrade: '6° grado',
			};
		if (score >= 80 && score < 90)
			return { difficulty: 'Fácil', schoolGrade: '5° grado' };
		return { difficulty: 'Muy fácil', schoolGrade: '4° grado' };
	}

	getGPDifficulty(score: number): Pick<GutierrezPoliniScore, 'difficulty'> {
		if (score <= 20) return { difficulty: 'Muy dificil' };
		if (score >= 21 && score <= 40) return { difficulty: 'Dificil' };
		if (score >= 41 && score <= 60) return { difficulty: 'Normal' };
		if (score >= 61 && score <= 80) return { difficulty: 'Fácil' };
		return { difficulty: 'Muy fácil' };
	}

	getSPDifficulty(score: number): Omit<SzigrisztPazosScore, 'score'> {
		if (score < 16)
			return {
				difficulty: 'Muy dificil',
				type: 'Cientifica, filosófica',
				schoolGrade: 'Titulados universitarios',
			};
		if (score >= 16 && score <= 35)
			return {
				difficulty: 'Árido',
				type: 'pedagógica, técnica',
				schoolGrade: 'Selectividad y estudios universitarios',
			};
		if (score >= 36 && score <= 50)
			return {
				difficulty: 'Bastante difícil',
				type: 'Literatura y divulgación',
				schoolGrade: 'Cursos secundarios',
			};
		if (score >= 51 && score <= 65)
			return {
				difficulty: 'Normal',
				type: 'Los media',
				schoolGrade: 'Popular',
			};
		if (score >= 66 && score <= 75)
			return {
				difficulty: 'Bastante fácil',
				type: 'Novela, revista',
				schoolGrade: '12 años',
			};
		if (score >= 76 && score <= 85)
			return {
				difficulty: 'Fácil',
				type: 'Para quioscos',
				schoolGrade: '11 años',
			};

		return {
			difficulty: 'Muy fácil',
			type: 'Cómics y viñetas',
			schoolGrade: '6 a 10 años',
		};
	}

	getINFDifficulty(score: number): Pick<InfleszScore, 'difficulty'> {
		if (score < 41) return { difficulty: 'Muy dificil' };
		if (score >= 41 && score <= 55) return { difficulty: 'Algo dificil' };
		if (score >= 56 && score <= 65) return { difficulty: 'Normal' };
		if (score >= 66 && score <= 80) return { difficulty: 'Bastante fácil' };
		return { difficulty: 'Muy fácil' };
	}

	normalizeScore(score: number) {
		let scoreNum = Math.min(score, 100);
		scoreNum = Math.max(0, scoreNum);
		return Number(scoreNum.toFixed(2));
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
