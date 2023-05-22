import { User } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
	@IsString()
	@IsNotEmpty()
	oldPassword: string;

	@IsString()
	@IsNotEmpty()
	newPassword: string;
}

export interface ChangePasswordService extends ChangePasswordDto {
	userId: User['id'];
}
