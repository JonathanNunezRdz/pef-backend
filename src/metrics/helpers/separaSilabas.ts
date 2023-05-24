// Convertido a Typescript basado en:
// Based on Mabodo's ipython notebook (https://github.com/mabodo/sibilizador)

type CharType = 'V' | 'v' | 'x' | 's' | 'c';

const STRONG_VOWEL = new Set(['a', 'á', 'e', 'é', 'o', 'ó', 'í', 'ú']);
const WEAK_VOWEL = new Set(['i', 'u', 'ü']);
const CONSONANT = new Set(['c', 's', 'x', 'cs']);
const RULES: [string, number][] = [
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

export class Silabizer {
	syllables: string[];
	rawSyllables: CharLine[];

	constructor(word: string) {
		this.rawSyllables = this.split(new CharLine(word));
		this.syllables = this.rawSyllables.map((syl) => syl.word);
	}

	get totalSyllables() {
		return this.rawSyllables.length;
	}

	split(char: CharLine): CharLine[] {
		// ciclar por las reglas de separacion de silabas
		for (const [rule, where] of RULES) {
			// checar la regla actual en la parte de la palabra actual
			const applies = char.splitBy(rule, where);

			// si no aplica, saltar a la siguiente regla
			if (!applies) continue;

			// si si aplica, extraer las dos partes separadas y checar las siguientes
			// excepciones
			const [first, second] = applies;

			// excepcion: una consonante sola no puede ser silaba
			if (CONSONANT.has(first.typeLine) || CONSONANT.has(second.typeLine))
				continue;

			// excepcion: si una silaba termina en consonante y la siguiente silaba
			// es 'l' o 'r', se toma como una sola silaba
			if (
				first.typeLine.at(-1) === 'c' &&
				['l', 'r'].includes(second.word.at(0) ?? '')
			)
				continue;

			// excepcion: casos extremos, si las dos silabas terminan el 'l', no
			// se separa
			if (first.word.at(-1) === 'l' && second.word.at(-1) === 'l')
				continue;

			// excepcion: casos extremos, si las dos silabas terminan el 'r', no
			// se separa
			if (first.word.at(-1) === 'r' && second.word.at(-1) === 'r')
				continue;

			// excepcion: casos extremos, si una silaba termina en 'c' y la otra en
			// 'h', no se separa
			if (first.word.at(-1) === 'c' && second.word.at(-1) === 'h')
				continue;

			// si no hay excepciones, checar si las silabas son aun más separables
			// y aplicar recursividad
			return [...this.split(first), ...this.split(second)];
		}
		// si no aplica ninguna regla, se toma como caso base: es una silaba valida
		return [char];
	}
}
