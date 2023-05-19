export type BaseScore = {
	value: number;
	level?: string;
	extra?: ScoreExtra;
};

export type ScoreExtra = Record<
	string,
	{
		label: string;
		value: string;
	}
>;
