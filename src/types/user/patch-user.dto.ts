import { User } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
	@IsString()
	@IsOptional()
	firstName?: User['firstName'];

	@IsString()
	@IsOptional()
	lastName?: User['lastName'];
}

export interface PatchUserService {
	patchUserDto: PatchUserDto;
	userId: User['id'];
}
