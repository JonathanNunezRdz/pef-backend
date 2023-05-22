import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '@src/auth/decorator';
import { JwtGuard } from '@src/auth/guard';
import { EmailService } from '@src/email/email.service';
import { ChangePasswordDto, PatchUserDto } from '@src/types/user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly email: EmailService
	) {}

	// get routes
	@UseGuards(JwtGuard)
	@Get('me')
	getMe(@GetUser('id') userId: User['id']) {
		return this.userService.getMe(userId);
	}

	// post routes

	// put/patch routes
	@UseGuards(JwtGuard)
	@Patch('')
	patchUser(
		@GetUser('id') userId: User['id'],
		@Body() patchUserDto: PatchUserDto
	) {
		return this.userService.patchUser({ patchUserDto, userId });
	}

	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.OK)
	@Patch('change_password')
	changePassword(
		@GetUser('id') userId: User['id'],
		@Body() dto: ChangePasswordDto
	) {
		return this.userService.changePassword({ ...dto, userId });
	}

	// delete routes
	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.OK)
	@Delete('')
	deleteUser(@GetUser('id') userId: User['id']) {
		return this.userService.deleteUser(userId);
	}
}
