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
		const numOfSentences = this.countSentences(text);

		const lengths = words.map((word) => word.length);

		return {
			numOfLetters,
			numOfSyllables,
			numOfWords: words.length,
			numOfSentences,
			avgLettersPerWord: numOfLetters / words.length,
			avgSyllablePerWord: numOfSyllables / words.length,
			avgWordsPerSentence: words.length / numOfSentences,
			avgSentencesPerHundredWords: (100 * numOfSentences) / words.length,
			avgSyllablesPerHundredWords: (100 * numOfSyllables) / words.length,
			varLettersPerWord: variance(...lengths),
			numOfSamples,
		};
	}

	getAveragePerHundredWords(words: string[], numOfSamples: number) {
		// const capitalLettersIndexes: number[] = [];
		for (let i = 0; i < numOfSamples; i++) {
			const index = Math.random() * words.length - 100;
			// si el texto tiene menos de 100 palabras, user todo el texto,
		}
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

	getSentences() {
		// transform this answer to javascript and that fits the spanish language
		// https://stackoverflow.com/questions/4576077/how-can-i-split-a-text-into-sentences#answer-31505798
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

// write a function that returns a number between 0 and x
// but only retr
