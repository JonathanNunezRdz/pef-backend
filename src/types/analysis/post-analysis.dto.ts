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

export type PostAnalysisService = Required<PostAnalysisDto>;

export class SaveAnalysisDto extends PostAnalysisDto {
	@IsString()
	@IsOptional()
	description?: string;
}

export interface SaveAnalysisService {
	userId: User['id'];
	postDto: PostAnalysisService;
	description?: string;
}

export class PostAnalysisWithFileDto {
	@IsInt()
	@Type(() => Number)
	@Min(1)
	@IsOptional()
	numOfSamples?: number;
}

export interface PostAnalysisWithFileService {
	numOfSamples: number;
	document: Express.Multer.File;
}

export class SaveAnalysisWithFileDto extends PostAnalysisWithFileDto {
	@IsString()
	@IsOptional()
	description?: string;
}

export interface SaveAnalysisWithFileService {
	userId: User['id'];
	postDto: PostAnalysisWithFileService;
	description?: string;
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
}

export class SaveAnalysisWithUrlDto extends PostAnalysisWithUrlDto {
	@IsString()
	@IsOptional()
	description?: string;
}

export interface SaveAnalysisWithUrlService {
	userId: User['id'];
	postDto: PostAnalysisWithUrlService;
	description?: string;
}
