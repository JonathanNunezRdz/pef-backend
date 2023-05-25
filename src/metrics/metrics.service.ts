import { Injectable } from '@nestjs/common';
import { GetMetricsService, Metrics } from '@src/types';
import { Silabizer, numToWord } from './helpers';

type RegExpMatchArrayWithIndices = RegExpMatchArray & {
	indices: Array<[number, number]>;
};
interface AverageMetricsArgs {
	totalWords: number;
	wordsPerSentence: string[][];
	totalSentences: number;
	numOfSamples: number;
	lastIndex: number;
	totalSyllables: number;
	syllablesPerSentence: Silabizer[][];
}

@Injectable()
export class MetricsService {
	getMetrics(dto: GetMetricsService): Metrics {
		let { text } = dto;
		const { numOfSamples } = dto;

		text = sanitizeText(text);
		text = numbersToWords(text);

		const sentences = this.getSentences(text);
		const wordsPerSentence = sentences.map((sentence) => {
			try {
				return this.getWords(sentence);
			} catch (error) {
				return [];
			}
		});
		const lastIndex = this.getValidLastSentenceIndex(
			wordsPerSentence,
			sentences.length
		);
		const totalWords = wordsPerSentence.reduce(
			(acc, curr) => acc + curr.length,
			0
		);
		const totalLetters = this.countLetters(
			wordsPerSentence.reduce((prev, curr) => [...prev, ...curr], [])
		);
		/**
		 * Array of sentences. Each element is an array of syllables.
		 */
		const syllablesPerSentence = wordsPerSentence.map((sentence) =>
			this.getSyllables(sentence)
		);
		const totalSyllables = syllablesPerSentence.reduce(
			(prev, curr) => prev + this.countAllSyllables(curr),
			0
		);
		const totalSentences = sentences.length || 1;

		const letterPerWord = wordsPerSentence.reduce<number[]>(
			(prev, curr) => {
				const asd = curr.map((word) => word.length);
				return [...prev, ...asd];
			},
			[]
		);
		const { avgSentencesPerHundredWords, avgSyllablesPerHundredWords } =
			this.getAverageSentencesAndSyllablesPerHundredWords({
				lastIndex,
				numOfSamples,
				syllablesPerSentence,
				totalSentences,
				totalSyllables,
				totalWords,
				wordsPerSentence,
			});

		return {
			numOfLetters: totalLetters,
			numOfSyllables: totalSyllables,
			numOfWords: totalWords,
			numOfSentences: totalSentences,
			avgLettersPerWord: totalLetters / totalWords,
			avgSyllablePerWord: totalSyllables / totalWords,
			avgWordsPerSentence: totalWords / totalSentences,
			avgSentencesPerHundredWords,
			avgSyllablesPerHundredWords,
			varLettersPerWord: variance(letterPerWord),
			numOfSamples,
		};
	}

	getAverageSentencesAndSyllablesPerHundredWords(
		args: AverageMetricsArgs
	): Pick<
		Metrics,
		'avgSentencesPerHundredWords' | 'avgSyllablesPerHundredWords'
	> {
		// get a random index from the list of sentences and count from there
		// example
		/**
		 * (sentences) [ ..., ... , ...] -> get index 1
		 * from sentence at index 1, count the number of words until 100 words
		 * if numOfWords is less than 100, continue to the next sentence and repeat
		 * When reaching 100 words, count the number of sentences that you traversed
		 *
		 * Exceptions:
		 * When the text is less or equal than 100 words, just count the sentences and return
		 */
		const {
			totalWords,
			lastIndex,
			numOfSamples,
			totalSentences,
			wordsPerSentence,
			totalSyllables,
			syllablesPerSentence,
		} = args;

		if (totalWords <= 100) {
			return {
				avgSentencesPerHundredWords:
					totalSentences * (100 / totalWords),
				avgSyllablesPerHundredWords:
					totalSyllables * (100 / totalWords),
			};
		}

		const numOfSentencesPerGroup: number[] = [];
		const numOfSyllablesPerGroup: number[] = [];

		for (let j = 0; j < numOfSamples; j++) {
			const [first] = getRandomIndexes(lastIndex, 0);
			let accumulatedWords = 0;
			let accumulatedSentences = 0;
			let accumulatedSyllables = 0;

			for (let i = first; i < totalSentences; i++) {
				accumulatedWords += wordsPerSentence[i].length;
				accumulatedSyllables += this.countAllSyllables(
					syllablesPerSentence[i]
				);
				accumulatedSentences++;

				if (accumulatedWords >= 100) {
					break;
				}
			}

			numOfSentencesPerGroup.push(
				accumulatedSentences * (100 / accumulatedWords)
			);
			numOfSyllablesPerGroup.push(
				accumulatedSyllables * (100 / accumulatedWords)
			);
		}

		return {
			avgSentencesPerHundredWords:
				numOfSentencesPerGroup.reduce((acc, cur) => acc + cur, 0) /
				numOfSamples,
			avgSyllablesPerHundredWords:
				numOfSyllablesPerGroup.reduce((acc, cur) => acc + cur, 0) /
				numOfSamples,
		};
	}

	getWords(text: string): string[] {
		const words = text.match(/\p{L}+/gu);
		if (!words) throw new Error('no matches for words');
		return words;
	}

	countLetters(words: string[]): number {
		return words.reduce((acc, curr) => acc + curr.length, 0) || 1;
	}

	getSyllables(words: string[]) {
		const allSyllables = words.map(
			(word) => new Silabizer(word.toLowerCase())
		);
		return allSyllables;
	}

	countAllSyllables(syllables: Silabizer[]) {
		return syllables.reduce((acc, curr) => acc + curr.totalSyllables, 0);
	}

	getSentences(text: string) {
		// transform this answer to javascript and that fits the spanish language
		// https://stackoverflow.com/questions/4576077/how-can-i-split-a-text-into-sentences#answer-31505798
		return text
			.replace('\n', '')
			.split(/\b(?<![.!?:;]\p{L})[.!?:;]/u)
			.filter((elem) => elem !== '');
	}

	countSentences(text: string) {
		return (
			text
				.replace('\n', '')
				.split(/[.!?:;]/)
				.filter((elem) => elem !== '').length || 1
		);
	}

	/**
	 * Count words of sentences starating from the last sentence of the text
	 * until it reaches 100. When reached, set the index to the last sentence
	 * entered. This index determines the last sentence from which you can reach
	 * 100 words until the end of the text
	 */
	getValidLastSentenceIndex(
		wordsPerSentence: string[][],
		totalSentences: number
	) {
		let accumulatedWords = 0;
		for (let i = totalSentences - 1; i >= 0; i--) {
			accumulatedWords += wordsPerSentence[i].length;
			if (accumulatedWords >= 100) {
				return i;
			}
		}
		return 0;
	}
}

export function variance(arr: number[]) {
	if (arr.length === 0) return 0;
	const sum = arr.reduce((prev, curr) => prev + curr, 0);
	const { length: num } = arr;
	const median = sum / num;
	return (
		arr.reduce((prev, x) => {
			return prev + (x - median) * (x - median);
		}, 0) / num
	);
}

export function sanitizeText(text: string): string {
	return text.replace(/[«»]/g, `"`).replace(/(\r\n|\n|\r)+/gm, ' ');
}

export function isLetter(char: string) {
	return /\p{L}/u.test(char);
}

export function numbersToWords(text: string) {
	const numFormat = /[\-]?[1-9][0-9]*\.?[0-9]*/d;
	const newText = text
		.split(' ')
		.map((word) => {
			const cleanPart = numFormat.exec(word);
			if (cleanPart) {
				if (cleanPart[0].includes('-')) {
					const [first, last] = (
						cleanPart as RegExpMatchArrayWithIndices
					).indices[0];
					const part = word.slice(first + 1, last);
					try {
						const convertedPart = numToWord(Number(part));
						return `${word.slice(
							0,
							first
						)}negativo ${convertedPart}${word.slice(last)}`;
					} catch (error) {
						console.log('fallido en:', cleanPart);
						console.log('fallido en:', part);
						throw error;
					}
				} else {
					const [first, last] = (
						cleanPart as RegExpMatchArrayWithIndices
					).indices[0];
					const part = word.slice(first, last);
					try {
						const convertedPart = numToWord(Number(part));
						return `${word.slice(
							0,
							first
						)}${convertedPart}${word.slice(last)}`;
					} catch (error) {
						console.log('no es negativo');
						console.log('fallido en:', cleanPart);
						console.log('fallido en:', part);
						throw error;
					}
				}
			}
			return word;
		})
		.join(' ');
	return newText;
}

export function getRandomIndexes(
	limit: number,
	offset: number
): [number, number] {
	const first = Number((Math.random() * (limit - offset)).toFixed(0));
	return [first, first + offset - 1];
}
