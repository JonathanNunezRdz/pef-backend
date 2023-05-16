import { User } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PostAnalysisDto {
	@IsString()
	text: string;

	@IsInt()
	@Min(1)
	@IsOptional()
	numOfSamples?: number;
}

export class SaveAnalysisDto extends PostAnalysisDto {
	@IsString()
	@IsOptional()
	description?: string;
}

export class PostAnalysisWithFileDto {
	@IsInt()
	@Type(() => Number)
	@Min(1)
	@IsOptional()
	numOfSamples?: number;
}

export class PostAnalysisWithUrlDto {
	@IsString()
	url: string;

	@IsInt()
	@Min(1)
	@IsOptional()
	numOfSamples?: number;
}

export interface PostAnalysisWithUrlService {
	url: string;
	numOfSamples: number;
	userId?: User['id'];
}

export interface PostAnalysisWithFileService {
	numOfSamples: number;
	document: Express.Multer.File;
	userId?: User['id'];
}

export interface PostAnalysisService {
	text: string;
	numOfSamples: number;
}

export interface SaveAnalysisService {
	userId: User['id'];
	postDto: PostAnalysisService;
	description?: string;
}
