import { User } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PostResultDto {
	@IsString()
	text: string;

	@IsInt()
	@Min(1)
	@IsOptional()
	numOfSamples?: number;

	@IsString()
	@IsOptional()
	description?: string;
}

export class PostResultWithFileDto {
	@IsInt()
	@Type(() => Number)
	@Min(1)
	@IsOptional()
	numOfSamples?: number;
}

export class PostResultWithUrlDto {
	@IsString()
	url: string;

	@IsInt()
	@Min(1)
	@IsOptional()
	numOfSamples?: number;
}

export interface PostResultService {
	text: string;
	numOfSamples: number;
	userId: User['id'];
}

export interface PostResultWithFileService {
	document: Express.Multer.File;
	numOfSamples: number;
	userId: User['id'];
}

export interface PostResultWithUrlService {
	url: string;
	numOfSamples: number;
	userId: User['id'];
}
