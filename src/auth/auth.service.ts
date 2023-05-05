import {
	ConflictException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '@src/prisma/prisma.service';
import { SignInDto, SignInResponse, SignUpDto } from '@src/types/user';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService
	) {}

	async signUp(dto: SignUpDto) {
		const { firstName, lastName, email, password } = dto;
		const hashedPassword = await hash(password);
		try {
			const rawUser = await this.prisma.user.create({
				data: {
					firstName,
					lastName,
					email,
					hash: hashedPassword,
				},
			});
			return this.signToken(rawUser.id, rawUser.email);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ConflictException('Credenciales ya en uso');
			}
			throw error;
		}
	}

	async signIn(dto: SignInDto) {
		const { email, password } = dto;
		const rawUser = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!rawUser) throw new ForbiddenException('Credenciales incorrectas');

		const valid = await verify(rawUser.hash, password);
		if (!valid) throw new ForbiddenException('Credenciales incorrectas');

		return this.signToken(rawUser.id, rawUser.email);
	}

	async signToken(
		userId: User['id'],
		email: User['email']
	): Promise<SignInResponse> {
		const payload = {
			sub: userId,
			email,
		};

		const token = await this.jwt.signAsync(payload);

		return {
			accessToken: token,
		};
	}
}
