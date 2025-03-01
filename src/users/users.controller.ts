import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import ActiveUser from '../iam/decorators/active-user.decorator'
import HashingService from '../iam/hashing/hashing.service'
import { Roles } from '../roles/decorators/roles.decorator'
import { Role } from '../roles/types/roles.type'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly hashingService: HashingService,
	) {}

	@Post()
	@Roles(Role.ADMIN)
	async create(@ActiveUser('sub') userId: number, @Body() createUserDto: CreateUserDto) {
		this.usersService.comparePasswords(createUserDto.password, createUserDto.confirmPassword)
		const hashedPassword = await this.hashingService.hash(createUserDto.password)

		return this.usersService.create(userId, createUserDto, hashedPassword)
	}

	@Get()
	findAll() {
		return this.usersService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(+id)
	}

	@Patch(':id')
	@Roles(Role.ADMIN)
	update(@ActiveUser('sub') userId: number, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(userId, +id, updateUserDto)
	}

	@Patch('password/:id')
	@Roles(Role.ADMIN)
	async updatePassword(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		this.usersService.comparePasswords(updateUserDto.password, updateUserDto.confirmPassword)
		const hashedPassword = await this.hashingService.hash(updateUserDto.password)

		return this.usersService.updatePassword(+id, hashedPassword)
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id)
	}
}
