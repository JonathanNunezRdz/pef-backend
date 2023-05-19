export type ResultResponse = {
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
};

export type GetResultsResponse = {
	data: ResultResponse;
	totalAnalysis: number;
};

export type PatchResultResponse = {
	id: string;
	description: string;
};
