import {
	BadRequestException,
	Injectable,
	PreconditionFailedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from '@src/prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(config: ConfigService, private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get('JWT_SECRET'),
		});
	}

	async validate(payload: {
		sub: User['id'];
		email: User['email'];
	}): Promise<Omit<User, 'hash'>> {
		try {
			const rawUser = await this.prisma.user.findUnique({
				where: {
					id: payload.sub,
				},
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					createdAt: true,
					updatedAt: true,
				},
			});
			if (!rawUser) throw new PreconditionFailedException();

			return rawUser;
		} catch (error) {
			if (error instanceof PrismaClientValidationError) {
				throw new BadRequestException('JWT token inválido');
			}
			throw error;
		}
	}
}
