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
	// Main services

	textAnalyzer(): Metrics {
		const FHScore = this.alFH({} as Metrics);
		FHScore.difficulty
		return {} as Metrics;
	}

	// Algorithm services

	alFH(metrics: Metrics): FernandezHuertaScore {
		const { avgSyllablePerWord, avgWordsPerSentence } = metrics;
		let scoreNum = 206.84 - 60 * avgSyllablePerWord - 1.02 * avgWordsPerSentence;
        scoreNum = Number(scoreNum.toFixed(2));				
		return {
			score: scoreNum,
			...this.getFHDifficulty(scoreNum),
		};
	}

	// Helper services

	getFHDifficulty(score: number): Pick<FernandezHuertaScore, 'difficulty' | 'schoolGrade'> {
		if (score < 30) return { difficulty: 'Muy dificil', schoolGrade: 'Universitario (especialización)' }; else
		if (score >= 30 && score < 50) return { difficulty: 'Difícil', schoolGrade: 'Cursos selectivos' }; else
		if (score >= 50 && score < 60) return { difficulty: 'Moderadamente difícil', schoolGrade: 'Cursos selectivos' }; else
		if (score >= 60 && score < 70) return { difficulty: 'Normal', schoolGrade: '7° u 8° grado selectivos' }; else
		if (score >= 70 && score < 80) return { difficulty: 'Moderadamente fácil', schoolGrade: '6° grado' }; else
		if (score >= 80 && score < 90) return { difficulty: 'Fácil', schoolGrade: '5° grado' }; else
		return  { difficulty: 'Muy fácil', schoolGrade: '4° grado' };
		
	}	
}
