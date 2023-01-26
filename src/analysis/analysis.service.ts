import { Injectable } from '@nestjs/common';
import silabas from 'silabas';

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

export type Score = {
	score: number;
};

@Injectable()
export class AnalysisService {
	// main services

	textAnalyzer(rawText: string): Metrics {
		const metrics = this.getMetrics(rawText);

		// call all algorithms

		return metrics;
	}

	// algorithm services

	// helper services

	getMetrics(text: string): Metrics {
		// call python script to get metrics
		const sentences = this.getSentences(text);
		const words = this.getWords(text);
		const letters = words.join('');

		this.getSyllables(words[0]);

		return {
			numOfLetters: letters.length,
			numOfWords: words.length,
			numOfSentences: sentences.length,
		} as Metrics;
	}

	getSentences(text: string) {
		const pattern = new RegExp(/[.:;!?\)\()]/);
		const sentences = text
			.replace(/[\n\t\r]/g, '')
			.split(pattern)
			.filter((elem) => elem !== '');
		return sentences;
	}

	getWords(text: string) {
		const sentences = this.getSentences(text);
		const words = sentences
			.reduce((acc, sentence) => {
				const tempWords = sentence.split(' ');
				return [...acc, ...tempWords];
			}, [])
			.filter((word) => word !== '')
			.map(this.removeSpecialCharacters);
		return words;
	}

	getSyllables(text: string) {
		const sil = silabas(text);
		console.log(sil);

		// const pattern = new RegExp(/\W+/);
		// const word = text.replace(pattern, text);

		return ['dsad', 'asd'];
	}

	removeSpecialCharacters(text: string): string {
		const pattern = new RegExp(/[^\p{L}]/gu);
		return text.replace(pattern, '');
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
