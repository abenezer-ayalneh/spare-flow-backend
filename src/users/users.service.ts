import { Injectable, UnprocessableEntityException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(userId: number, createUserDto: CreateUserDto, password: string) {
		delete createUserDto.confirmPassword

		return this.prismaService.user.create({
			data: {
				name: createUserDto.name,
				username: createUserDto.username,
				phoneNumber: createUserDto.phoneNumber,
				password,
				active: createUserDto.active,
				Role: { connect: { id: createUserDto.roleId } },
				Creator: { connect: { id: userId } },
			},
			include: { Role: { select: { id: true, name: true } } },
		})
	}

	findAll() {
		return this.prismaService.user.findMany({ include: { Role: true }, orderBy: { createdAt: 'desc' } })
	}

	findOne(id: number) {
		return this.prismaService.user.findUnique({
			where: { id },
			include: { Role: true },
		})
	}

	update(userId: number, id: number, updateUserDto: UpdateUserDto) {
		// To avoid self update for role and active status
		if (userId === id) {
			delete updateUserDto.active
			delete updateUserDto.roleId
		}

		return this.prismaService.user.update({ where: { id }, data: updateUserDto, include: { Role: true } })
	}

	remove(id: number) {
		return this.prismaService.user.delete({ where: { id } })
	}

	comparePasswords(password: string, confirmPassword: string) {
		if (password !== confirmPassword) {
			throw new UnprocessableEntityException('Passwords do not match')
		}
	}

	updatePassword(userId: number, password: string) {
		return this.prismaService.user.update({
			where: { id: userId },
			data: { password },
		})
	}
}
