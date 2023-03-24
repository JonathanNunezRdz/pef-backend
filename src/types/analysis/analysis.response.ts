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
