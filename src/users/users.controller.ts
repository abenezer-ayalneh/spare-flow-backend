import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import HashingService from '../iam/hashing/hashing.service'
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
	async create(@Body() createUserDto: CreateUserDto) {
		const password = this.usersService.generateSecureRandomPassword()
		const hashedPassword = await this.hashingService.hash(password)

		return this.usersService.create(createUserDto, hashedPassword)
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
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id)
	}
}
