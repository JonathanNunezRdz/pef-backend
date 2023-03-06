// TODO: type out the response that the frontend is going to receive

import { BaseAlgorithmScore } from 'types';

export type AnalysisResponse = {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	scores: BaseAlgorithmScore[];
};

export type PostAnalysisResponse = AnalysisResponse;
