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

export type FernandezHuertaScore = Score & {
	difficulty: string
	schoolGrade: string;
};

export type Score = {
	score: number;
};

@Injectable()
export class AnalysisService {
	// main services

	textAnalyzer(): Metrics {
		const FHScore = this.alFH({} as Metrics);
		FHScore.difficulty
		return {} as Metrics;
	}

	// algorithm services

	alFH(metrics: Metrics): FernandezHuertaScore {
		// const {  } = metrics;
		// matematicas
		const scoreNum = 23;

		return {
			score: 23,
			...this.getFHDifficulty(scoreNum),
		};
	}

	// helper services

	getFHDifficulty(score: number): Pick<FernandezHuertaScore, 'difficulty' | 'schoolGrade'> {
		if (score < 30) return { difficulty: 'asd', schoolGrade: '' };
		return { difficulty: 'asd', schoolGrade: '' };
	}

	getFHSchoolGrade() { }
}
