import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysisService {
	textAnalyzer(rawText: string) {
		const sentences = this.parseSentences(rawText);
		const totalWords = sentences.reduce(
			(acc, sentence) => this.parseWords(sentence).length + acc,
			0
		);
		const meanOfWordsPerSentence = totalWords / sentences.length;
		return meanOfWordsPerSentence;
	}

	parseSentences(rawText: string) {
		return rawText.split('.');
	}

	parseWords(text: string) {
		return text.split(' ');
	}

	// calculateMeanOfSyllablesPerWord(words: string[]) {
	// 	return 0;
	// }
}
