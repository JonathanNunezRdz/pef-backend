import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PostAnalysisDto {
	@IsString()
	text: string;

	@IsInt()
	@Min(1)
	@IsOptional()
	numOfSamples: number;
}

export class PostAnalysisWithFileDto {
	@IsInt()
	@Min(1)
	@IsOptional()
	numOfSamples?: number;
}

export interface PostAnalysisWithFileService {
	numOfSamples: number;
	document: Express.Multer.File;
}
