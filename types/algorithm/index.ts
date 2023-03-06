import { BaseScore } from '..';

export type BaseAlgorithmScore = {
	id: string;

	name: string;
	unit: string;
	min: number;
	max: number;

	score: BaseScore;
};
