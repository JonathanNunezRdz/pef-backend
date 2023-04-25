import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto, SignUpDto } from '@src/types/user';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private auth: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@Post('signup')
	signUp(@Body() dto: SignUpDto) {
		return this.auth.signUp(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signIn(@Body() dto: SignInDto) {
		return this.auth.signIn(dto);
	}
}
