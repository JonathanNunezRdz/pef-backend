import { Injectable } from '@nestjs/common';
import { UtilService } from '../util/util.service';

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

export type FernandezHuertaScore = Score & {
	difficulty: string;
	schoolGrade: string;
};

export type Score = {
	score: number;
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
	stdLettersPerWord: number;
};

export type FernandezHuertaScore = Score & {
	difficulty: string
	schoolGrade: string
};

export type GutierrezPoliniScore = Score & {
	difficulty: string	
};

export type SzigrisztPazosScore = Score & {
	difficulty: string
	type: string
	schoolGrade: string	
};

export type InfleszScore = Score & {
	difficulty: string	
};

export type muScore = Score & {
	difficulty: string	
};

export type Score = {
	score: number;
};

@Injectable()
export class AnalysisService {
	constructor(private utilService: UtilService) {}
	
  // main services

	textAnalyzer(rawText: string): Metrics {
		const metrics = this.getMetrics(rawText);

		// call all algorithms

		return metrics;
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

	alGP(metrics: Metrics): GutierrezPoliniScore {
		const { numOfLetters, numOfWords, numOfSentences } = metrics;
		let scoreNum = 95.2 - 9.7 * (numOfLetters / numOfWords) - 0.35 * (numOfWords / numOfSentences);
        scoreNum = Number(scoreNum.toFixed(2));				
		return {
			score: scoreNum,
			...this.getGPDifficulty(scoreNum),
		};
	}

	alCrawford(metrics: Metrics): Score {
		const { numOfSyllables, numOfWords, numOfSentences } = metrics;
		let SyPHW = 100 * numOfSyllables / numOfWords;
		let SePHW = 100 * numOfSentences / numOfWords;
		let scoreNum = -0.205 * SePHW + 0.049 * SyPHW - 3.407;
        scoreNum = Number(scoreNum.toFixed(1));				
		return {
			score: scoreNum			
		};
	}

	alSP(metrics: Metrics): SzigrisztPazosScore {
		const { numOfSyllables, numOfWords, numOfSentences } = metrics;
		let scoreNum = 206.835 - 62.3 * ( numOfSyllables / numOfWords) - (numOfWords / numOfSentences);
        scoreNum = Number(scoreNum.toFixed(2));				
		return {
			score: scoreNum,
			...this.getSPDifficulty(scoreNum),
		};
	}

	alInflesz(metrics: Metrics): InfleszScore {
		const { numOfSyllables, numOfWords, numOfSentences } = metrics;
		let scoreNum = 206.835 - 62.3 * ( numOfSyllables / numOfWords) - (numOfWords / numOfSentences);
        scoreNum = Number(scoreNum.toFixed(2));				
		return {
			score: scoreNum,
			...this.getINFDifficulty(scoreNum),
		};
	}

	// WIP
	alMu(metrics: Metrics): muScore {
		return {
			score: 0,
			difficulty: ""
		}
	}

	// Helper services
  
  getMetrics(text: string): Metrics {
		// save text to file so python can use the text
		const file = this.utilService.writeFile(text);
		// call python script to get metrics
		const metrics = this.utilService.spawnPython<Metrics>(file);
		// remove file
		return metrics;
	}

	getFHDifficulty(score: number): Pick<FernandezHuertaScore, 'difficulty' | 'schoolGrade'> {
		if (score < 30) return { difficulty: 'Muy dificil', schoolGrade: 'Universitario (especialización)' }; else
		if (score >= 30 && score < 50) return { difficulty: 'Difícil', schoolGrade: 'Cursos selectivos' }; else
		if (score >= 50 && score < 60) return { difficulty: 'Moderadamente difícil', schoolGrade: 'Cursos selectivos' }; else
		if (score >= 60 && score < 70) return { difficulty: 'Normal', schoolGrade: '7° u 8° grado selectivos' }; else
		if (score >= 70 && score < 80) return { difficulty: 'Moderadamente fácil', schoolGrade: '6° grado' }; else
		if (score >= 80 && score < 90) return { difficulty: 'Fácil', schoolGrade: '5° grado' }; else
		return  { difficulty: 'Muy fácil', schoolGrade: '4° grado' };
		
	}
	
	getGPDifficulty(score: number): Pick<GutierrezPoliniScore, 'difficulty'> {
		if (score <= 20) return { difficulty: 'Muy dificil'}; else
		if (score >= 21 && score <= 40) return { difficulty: 'Dificil'}; else
		if (score >= 41 && score <= 60) return { difficulty: 'Normal'}; else
		if (score >= 61 && score <= 80) return { difficulty: 'Fácil'}; else
		return { difficulty: 'Muy fácil'};
		
	}

	getSPDifficulty(score: number): Pick<SzigrisztPazosScore, 'difficulty' | 'type' | 'schoolGrade'> {
		if (score < 16) return { difficulty: 'Muy dificil', type: 'Cientifica, filosófica', schoolGrade: 'Titulados universitarios' }; else
		if (score >= 16 && score <=35) return { difficulty: 'Árido', type: 'pedagógica, técnica', schoolGrade: 'Selectividad y estudios universitarios' }; else
		if (score >= 36 && score <=50) return { difficulty: 'Bastante difícil', type: 'Literatura y divulgación', schoolGrade: 'Cursos secundarios' }; else
		if (score >= 51 && score <=65) return { difficulty: 'Normal', type: 'Los media', schoolGrade: 'Popular' }; else
		if (score >= 66 && score <=75) return { difficulty: 'Bastante fácil', type: 'Novela, revista', schoolGrade: '12 años' }; else
		if (score >= 76 && score <=85) return { difficulty: 'Fácil', type: 'Para quioscos', schoolGrade: '11 años' }; else
		return { difficulty: 'Muy fácil', type: 'Cómics y viñetas', schoolGrade: '6 a 10 años' };
		
	}

	getINFDifficulty(score: number): Pick<InfleszScore, 'difficulty'> {
		if (score < 41) return { difficulty: 'Muy dificil'}; else
		if (score >= 41 && score <=55) return { difficulty: 'Algo dificil'}; else
		if (score >= 56 && score <=65) return { difficulty: 'Normal'}; else
		if (score >= 66 && score <=80) return { difficulty: 'Bastante fácil'}; else
		return { difficulty: 'Muy fácil'};
		
	}
}

export const TEST_TEXT = `Vivo en una casa pequeña 
pero moderna en el centro 
de la ciudad? Mi casa 
tiene dos habitaciones, 
un baño, una sala de estar, 
una cocina y una pequeña 
terraza. Por las tardes el 
sol calienta la casa durante 
horas, así que no suele 
hacer frío.`;

/**
 * total de letras = 189
 * total de silabas = 85
 * total de palabras = 46
 * total de oraciones = 3
 */

/**
 * Formulas
-> huerta
    -> L = 206.84 - 0.60P - 1.02F
    -> P = promedio de silabas por palabra
    -> F = media de palabras por frase
-> polini
    -> C = 95.2 - (9.7L / P) - (0.35P / F)
    -> L = numero de letras
    -> P = numero de palabras
    -> F = numero de frases
-> crawford
    -> A = -0.205OP + 0.049SP - 3.047
    -> OP = numero de oraciones por cien palabras
    -> SP = numero de silabas por cien palabras
-> pazos
    -> P = 206.835 - (62.3S / P) - (P / F)
    -> S = total de silabas
    -> P = cantidad de palabras
    -> F = numero de frases
-> barrio
    -> igual que pazos
-> miu
    -> u = (n / (n - 1)) (x / v) * 100
    -> n = numero de palabras
    -> x = media de letras por palabra
    -> v = varianza de letras por palabras
 */
