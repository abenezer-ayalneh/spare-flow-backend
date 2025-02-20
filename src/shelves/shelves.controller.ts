import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { Roles } from '../roles/decorators/roles.decorator'
import { Role } from '../roles/types/roles.type'
import { CreateShelfDto } from './dto/create-shelf.dto'
import { UpdateShelfDto } from './dto/update-shelf.dto'
import { ShelvesService } from './shelves.service'

@Controller('shelves')
export class ShelvesController {
	constructor(private readonly shelvesService: ShelvesService) {}

	@Post()
	@Roles(Role.ADMIN)
	create(@Body() createShelfDto: CreateShelfDto) {
		return this.shelvesService.create(createShelfDto)
	}

	@Get()
	findAll() {
		return this.shelvesService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.shelvesService.findOne(+id)
	}

	@Patch(':id')
	@Roles(Role.ADMIN)
	update(@Param('id') id: string, @Body() updateShelfDto: UpdateShelfDto) {
		return this.shelvesService.update(+id, updateShelfDto)
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	remove(@Param('id') id: string) {
		return this.shelvesService.remove(+id)
	}
}
