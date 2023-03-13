type CharType = 'V' | 'v' | 'x' | 's' | 'c';

const STRONG_VOWEL = new Set(['a', 'á', 'e', 'é', 'o', 'ó', 'í', 'ú']);
const WEAK_VOWEL = new Set(['i', 'u', 'ü']);

class CharLine {
	word: string;
	charLine: [string, CharType][];
	typeLine: string;

	constructor(word: string) {
		this.word = word;
		this.charLine = word
			.split('')
			.map((letter) => [letter, this.charType(letter)]);
		this.typeLine = this.charLine.map(([, charType]) => charType).join('');
	}

	charType(char: string): CharType {
		if (STRONG_VOWEL.has(char)) return 'V';
		if (WEAK_VOWEL.has(char)) return 'v';
		if (char === 'x') return 'x';
		if (char === 's') return 's';
		return 'c';
	}

	find(finder: string) {
		return this.typeLine.indexOf(finder);
	}

	split(pos: number, where: number): [CharLine, CharLine] {
		return [
			new CharLine(this.word.slice(0, pos + where)),
			new CharLine(this.word.slice(pos + where)),
		];
	}

	splitBy(finder: string, where: number) {
		const splitPoint = this.find(finder);
		if (splitPoint !== -1) {
			return this.split(splitPoint, where);
		}
		return false;
	}

	toString() {
		return this.word;
	}
}

export class Sillabizer {
	syllables: string[];

	constructor(word: string) {
		this.syllables = this.split(new CharLine(word));
	}

	split(char: CharLine) {
		const rules: [string, number][] = [
			['VV', 1],
			['cccc', 2],
			['xcc', 1],
			['ccx', 2],
			['csc', 2],
			['xc', 1],
			['cc', 1],
			['vcc', 2],
			['Vcc', 2],
			['sc', 1],
			['cs', 1],
			['Vc', 1],
			['vc', 1],
			['Vs', 1],
			['vs', 1],
		];
		return [''];
	}
}
