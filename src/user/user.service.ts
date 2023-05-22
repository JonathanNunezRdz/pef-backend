import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import {
	ChangePasswordService,
	GetUserResponse,
	PatchUserResponse,
	PatchUserService,
} from '@src/types/user';
import { hash, verify } from 'argon2';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getMe(userId: User['id']): Promise<GetUserResponse> {
		const rawUser = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!rawUser) throw new NotFoundException('usuario no existente');

		return rawUser;
	}

	async patchUser(dto: PatchUserService): Promise<PatchUserResponse> {
		const { patchUserDto, userId } = dto;
		const { firstName, lastName } = patchUserDto;

		const oldUser = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
			},
		});

		if (!oldUser) throw new NotFoundException('usuario no existente');

		const updatedUser = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				firstName,
				lastName,
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return updatedUser;
	}

	async changePassword(dto: ChangePasswordService) {
		const { oldPassword, newPassword, userId } = dto;

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				hash: true,
			},
		});

		if (!user) throw new NotFoundException('Usuario no existente');

		const valid = await verify(user.hash, oldPassword);

		if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

		if (oldPassword === newPassword)
			throw new BadRequestException(
				'Tu contraseña nueva es igual a tu contraseña actual'
			);

		const hashedPassword = await hash(newPassword);

		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				hash: hashedPassword,
			},
		});
	}

	async deleteUser(userId: User['id']): Promise<void> {
		try {
			await this.prisma.user.delete({
				where: {
					id: userId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'el usuario no pudo ser eliminado, intenta más tarde'
			);
		}
	}
}
