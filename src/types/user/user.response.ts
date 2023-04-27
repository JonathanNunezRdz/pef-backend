import { User } from '@prisma/client';

export type UserResponse = Omit<User, 'hash'>;

export type GetUserResponse = UserResponse;

export type PostUserResponse = UserResponse;

export type PatchUserResponse = UserResponse;

export type SignInResponse = {
	accessToken: string;
};
