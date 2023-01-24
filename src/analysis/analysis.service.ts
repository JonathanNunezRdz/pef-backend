import { Injectable } from '@nestjs/common';

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
	stdLettersPerWord: number;
};

@Injectable()
export class AnalysisService {
	// main services

	textAnalyzer(): Metrics {
		return {} as Metrics;
	}

	// algorithm services

	// helper services
}
