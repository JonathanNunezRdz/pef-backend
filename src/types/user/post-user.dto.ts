import { User } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class PostUserDto {
	@IsEmail()
	email: string;

	@IsString()
	firstName: User['firstName'];

	@IsString()
	lastName: User['lastName'];

	@IsString()
	password: string;
}
