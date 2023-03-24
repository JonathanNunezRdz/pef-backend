export type BaseScore = {
	value: number;
	level?: string;
	extra?: ScoreExtra;
};

export type ScoreExtra = {
	[k: string]: {
		label: string;
		value: string;
	};
};
