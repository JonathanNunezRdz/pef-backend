import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import {
	GetUserResponse,
	PatchUserResponse,
	PatchUserService,
} from '@src/types/user';

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
