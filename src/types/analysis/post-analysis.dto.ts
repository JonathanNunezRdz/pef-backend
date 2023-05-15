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

export type PostAnalysisService =
	| PostAnalysisWithUser
	| PostAnalysisWithoutUser;

export interface PostAnalysisWithUser {
	text: string;
	numOfSamples: number;
	userId: User['id'];
	description: string;
}

export interface PostAnalysisWithoutUser {
	text: string;
	numOfSamples: number;
}
