import { Injectable } from '@nestjs/common';
import { GetMetricsService, Metrics } from '@src/types';
import { variance } from 'mathjs';
import { numToWord, Silabizer } from './helpers';

// const alphabet = '([\p{L}])';
// const prefixes = '(Sr|Sta|Sra|Srta|Dr)[.]';
// const suffixes = '(Inc|Ltd|Jr|Sr|Co)'
// const starters = ''

@Injectable()
export class MetricsService {
	getMetrics({ text, numOfSamples }: GetMetricsService): Metrics {
		debugger;
		text = numbersToWords(text);

		const words = this.getWords(text);
		const numOfLetters = this.countLetters(words);
		const syllables = this.getSyllables(words);
		const numOfSyllables = this.countAllSyllables(syllables);
		const sentences = this.getSentences(text);
		const numOfSentences = sentences.length || 1;

		const lengths = words.map((word) => word.length);

		const { avgSentencesPerHundredWords, avgSyllablesPerHundredWords } =
			this.getAverageSentencesAndSyllablesPerHundredWords(
				sentences,
				numOfSamples
			);

		return {
			numOfLetters,
			numOfSyllables,
			numOfWords: words.length,
			numOfSentences,
			avgLettersPerWord: numOfLetters / words.length,
			avgSyllablePerWord: numOfSyllables / words.length,
			avgWordsPerSentence: words.length / numOfSentences,
			avgSentencesPerHundredWords,
			avgSyllablesPerHundredWords,
			varLettersPerWord: variance(...lengths),
			numOfSamples,
		};
	}

	getAverageSentencesAndSyllablesPerHundredWords(
		sentences: string[],
		numOfSamples: number
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
		debugger;
		const numOfSentences = sentences.length || 1;
		const wordsPerSentence = sentences.map((sentence) =>
			this.getWords(sentence)
		);
		let lastIndex = numOfSentences - 1;
		let totalWords = 0;
		for (let i = numOfSentences - 1; i >= 0; i--) {
			totalWords += wordsPerSentence[i].length;
			if (totalWords >= 100) {
				lastIndex = i;
				break;
			}
		}
		const numOfWords = wordsPerSentence.reduce(
			(acc, curr) => acc + curr.length,
			0
		);
		if (numOfWords <= 100) {
			const allSyllables = wordsPerSentence.reduce<Silabizer[]>(
				(acc, cur) => {
					return [...acc, ...this.getSyllables(cur)];
				},
				[]
			);
			return {
				avgSentencesPerHundredWords:
					numOfSentences * (100 / numOfWords),
				avgSyllablesPerHundredWords:
					this.countAllSyllables(allSyllables) * (100 / numOfWords),
			};
		}

		const numOfSentencesPerGroup: number[] = [];
		const numOfSyllablesPerGroup: number[] = [];
		for (let j = 0; j < numOfSamples; j++) {
			const [first] = getRandomIndexes(lastIndex, 0);
			totalWords = 0;
			let totalSentences = 0;
			let totalSyllables = 0;

			for (let i = first; i < numOfSentences; i++) {
				totalWords += wordsPerSentence[i].length;
				totalSyllables += this.countAllSyllables(
					this.getSyllables(wordsPerSentence[i])
				);
				totalSentences++;

				if (totalWords >= 100) {
					break;
				}
			}

			numOfSentencesPerGroup.push(totalSentences * (100 / totalWords));
			numOfSyllablesPerGroup.push(totalSyllables * (100 / totalWords));
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

	getAverageSyllablesPerHundredWords(
		wordsWithSyllables: Silabizer[],
		numOfSamples: number
	) {
		const numOfWords = wordsWithSyllables.length;
		if (numOfWords <= 100) {
			return (
				this.countAllSyllables(wordsWithSyllables) * (100 / numOfWords)
			);
		}
		const numOfSyllablesPerGroup: number[] = [];
		for (let i = 0; i < numOfSamples; i++) {
			const [first, last] = getRandomIndexes(numOfWords, 100);
			const numOfSyllables = this.countAllSyllables(
				wordsWithSyllables.slice(first, last)
			);
			numOfSyllablesPerGroup.push(numOfSyllables);
		}
		return (
			numOfSyllablesPerGroup.reduce((acc, cur) => acc + cur, 0) /
			numOfSamples
		);
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
			.split(/[.!?:;]/)
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
}

export function isLetter(char: string) {
	return /\p{L}/u.test(char);
}

export function numbersToWords(text: string) {
	const numFormat = /^[\-]?[1-9][0-9]*\.?[0-9]+$/;
	const newText = text
		.split(' ')
		.map((word) => {
			if (numFormat.test(word)) {
				return numToWord(Number(word)); // change number to worded number
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
