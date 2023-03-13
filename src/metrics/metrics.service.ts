import { Injectable } from '@nestjs/common';
import { Metrics } from '@src/types';
import { UtilService } from '@src/util/util.service';
import { numToWord } from './helpers';

@Injectable()
export class MetricsService {
	constructor(private utilService: UtilService) {}

	getMetrics(text: string): Partial<Metrics> {
		debugger;
		text = numbersToWords(text);

		return {
			numOfLetters: this.countLetters(text),
			numOfSyllables: this.countAllSyllables(text),
		};
	}

	countLetters(text: string): number {
		return text.match(/\p{L}/gu)?.length || 1;
	}

	countAllSyllables(text: string) {
		// let total = 0;
		const cleaned = text
			.replace(/[^\p{L}\s]/gu, '')
			.split(' ')
			.filter((elem) => elem !== '');

		return cleaned.length;
	}

	countSyllables(word: string) {
		// use silabizer created for current word
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
