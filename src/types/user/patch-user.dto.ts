import { User } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	firstName?: User['firstName'];

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	lastName?: User['lastName'];
}

export interface PatchUserService {
	patchUserDto: PatchUserDto;
	userId: User['id'];
}
