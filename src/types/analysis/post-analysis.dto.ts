import { IsString } from 'class-validator';

export class PostAnalysisDto {
	@IsString()
	text: string;
}
