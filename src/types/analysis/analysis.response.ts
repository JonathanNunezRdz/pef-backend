// TODO: type out the response that the frontend is going to receive

import { BaseAlgorithmScore, Metrics } from '..';

export type AnalysisResponse = {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	scores: BaseAlgorithmScore[];
	metrics: Metrics;
};

export type PostAnalysisResponse = AnalysisResponse;

export type GetAnalysisResponse = {
	data: {
		id: string;
		createdAt: Date;

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
