import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createUserDto: CreateUserDto, password: string) {
		return this.prismaService.user.create({ data: { ...createUserDto, password }, include: { Role: true } })
	}

	findAll() {
		return this.prismaService.user.findMany({ include: { Role: true }, orderBy: { createdAt: 'desc' } })
	}

	findOne(id: number) {
		return this.prismaService.user.findUnique({ where: { id }, include: { Role: true } })
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return this.prismaService.user.update({ where: { id }, data: updateUserDto, include: { Role: true } })
	}

	remove(id: number) {
		return this.prismaService.user.delete({ where: { id } })
	}

	generateSecureRandomPassword(length: number = 12): string {
		let password = ''

		for (let i = 0; i < length; i++) {
			password += String.fromCharCode((crypto.randomBytes(1)[0] % 94) + 33) // Generate random ASCII characters
		}

		return password
	}
}
