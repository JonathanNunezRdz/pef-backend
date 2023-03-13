import { Metrics } from '@customTypes';
import { Injectable } from '@nestjs/common';
import { numToWord } from './helpers/numberToWord';

@Injectable()
export class MetricsService {
	getMetrics(text: string): Partial<Metrics> {
		text = numbersToWords(text);
		return {
			numOfLetters: this.countLetters(text),
		};
	}

	countLetters(text: string): number {
		return text.split('').filter(isLetter).length || 1;
	}

	countAllSyllables(text: string) {
		const cleaned = text
			.replace(/[^\p{L}\s]/gu, '')
			.split(' ')
			.filter((elem) => elem !== '')
			.join(' ');
		return cleaned;
	}
}

function isLetter(char: string) {
	return char.toLowerCase() !== char.toUpperCase();
}

function numbersToWords(text: string) {
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
