import { BaseAlgorithmScore, ResponseVariable } from '..';

export type AnalysisResponse = {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	scores: BaseAlgorithmScore[];
	metrics: ResponseVariable[];
	originalText?: string;
};

export type SaveAnalysisResponse = AnalysisResponse & {
	description: string;
};

export type PostAnalysisResponse = AnalysisResponse;

export type GetAnalysisResponse = {
	data: {
		id: string;
		createdAt: Date;

		description: string;

		scores: {
			id: string;
			value: number;
			dificulty: string | null;

			algorithm: {
				name: string;
				unit: string;
				max: number;
			};
		}[];
	}[];
	totalAnalysis: number;
};
