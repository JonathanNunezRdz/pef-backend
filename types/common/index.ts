export type BaseScore = {
	value: number;
	difficulty?: string;
	extra?: Record<string, string>;
};

export type BaseAlgorithm = {
	id: string;

	name: string;
	unit: string;
	min: number;
	max: number;

	score: BaseScore;
};

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
