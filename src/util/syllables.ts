function Syllables(word: string) {
	let stressedFound = false;
	let stressed = 0;
	let letterAccent = -1;

	let positions: number[] = [];

	function process() {
		let numSyl = 0;

		// look for syllables in the word
		for (let i = 0; i < word.length; ) {
			positions[numSyl++] = i;

			i = onset(i);
			i = nucleus(i);
			i = coda(i);

			if (stressedFound && stressed === 0) {
				stressed = numSyl; // mark the stressed syllable
			}
		}

		// continue
	}

	function onset(pos: number) {
		let lastConsonant = 'a';

		while (pos < word.length && isConsonant(pos) && toLower(pos) !== 'y') {
			lastConsonant = toLower(pos);
			pos++;
		}

		// (q | g) + u
		if (pos < word.length - 1) {
			if (toLower(pos) === 'u') {
				if (lastConsonant === 'q') {
					pos++;
				} else if (lastConsonant === 'g') {
					const nextLetter = toLower(pos + 1);
					if (
						nextLetter === 'e' ||
						nextLetter === 'é' ||
						nextLetter === 'i' ||
						nextLetter === 'í'
					) {
						pos++;
					}
				}
			} else if (toLower(pos) === 'ü' && lastConsonant === 'g') {
				pos++;
			}
		}
	}

	function nucleus(pos: number) {
		// saves the type of previous vowel when two vowels exit together
		/**
		 * 0 = open;
		 * 1 = close with written accent;
		 * 2 = close;
		 */
		let previous: 0 | 1 | 2 = 0;

		if (pos >= word.length) return pos; // should have a nucleus

		// jumps a letter 'y' to the starting of nucleus, as it is a consonant
		if (toLower(pos) === 'y') pos++;

		if (pos < word.length) {
			switch (toLower(pos)) {
				// Open-vowel or close-vowel with written accent
				case 'á':
				case 'à':
				case 'é':
				case 'è':
				case 'ó':
				case 'ò':
					letterAccent = pos;
					stressedFound = true;
				// Open-vowel
				case 'a':
				case 'e':
				case 'o':
					previous = 0;
					pos++;
					break;
				// Close-vowel with written accent breaks some possible diphthong
				case 'í':
				case 'ì':
				case 'ú':
				case 'ù':
				case 'ü':
					letterAccent = pos;
					pos++;
					stressedFound = true;
					return pos;
				// Close-vowel
				case 'i':
				case 'I':
				case 'u':
				case 'U':
					previous = 2;
					pos++;
					break;
			}
		}

		// if 'h' has been inserted in the nucleus then it doesn't determine
		// diphthong neither hiatus

		let aitch = false;
		if (pos < word.length) {
			if (toLower(pos) === 'h') {
				pos++;
				aitch = true;
			}
		}

		// second vowel

		if (pos < word.length) {
			switch (toLower(pos)) {
				// Open-vowel with written accent
				case 'á':
				case 'à':
				case 'é':
				case 'è':
				case 'ó':
				case 'ò':
					letterAccent = pos;
					if (previous !== 0) {
						stressedFound = true;
					}
				// Open-vowel
				case 'a':
				case 'e':
				case 'o':
					if (previous === 0) {
						// Two open-vowels don't form syllable
						if (aitch) pos--;
						return pos;
					} else {
						pos++;
					}

					break;

				// Close-vowel with written accent, can't be a triphthong, but would be a diphthong
				case 'í':
				case 'ì':
				case 'ú':
				case 'ù':
					letterAccent = pos;

					if (previous != 0) {
						// Diphthong
						stressedFound = true;
						pos++;
					} else if (aitch) pos--;

					return pos;
				// Close-vowel
				case 'i':
				case 'u':
				case 'ü':
					if (pos < word.length - 1) {
						// ¿Is there a third vowel?
						if (!isConsonant(pos + 1)) {
							if (toLower(pos - 1) == 'h') pos--;
							return pos;
						}
					}

					// Two equals close-vowels don't form diphthong
					if (toLower(pos) != toLower(pos - 1)) pos++;

					return pos; // It is a descendent diphthong
			}
		}
	}

	function coda(pos: number) {}

	function toLower(pos: number) {
		return word[pos].toLowerCase();
	}

	function isConsonant(pos: number) {
		let c = word[pos];

		switch (c) {
			// Open-vowel or close-vowel with written accent
			case 'a':
			case 'á':
			case 'A':
			case 'Á':
			case 'à':
			case 'À':
			case 'e':
			case 'é':
			case 'E':
			case 'É':
			case 'è':
			case 'È':
			case 'í':
			case 'Í':
			case 'ì':
			case 'Ì':
			case 'o':
			case 'ó':
			case 'O':
			case 'Ó':
			case 'ò':
			case 'Ò':
			case 'ú':
			case 'Ú':
			case 'ù':
			case 'Ù':
			// Close-vowel
			case 'i':
			case 'I':
			case 'u':
			case 'U':
			case 'ü':
			case 'Ü':
				return false;
		}
		return true;
	}
}

export default Syllables;
