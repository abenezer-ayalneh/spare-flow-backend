import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { Roles } from '../roles/decorators/roles.decorator'
import { Role } from '../roles/types/roles.type'
import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { StoresService } from './stores.service'

@Controller('stores')
export class StoresController {
	constructor(private readonly storesService: StoresService) {}

	@Post()
	@Roles(Role.ADMIN)
	create(@Body() createStoreDto: CreateStoreDto) {
		return this.storesService.create(createStoreDto)
	}

	@Get()
	findAll() {
		return this.storesService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.storesService.findOne(+id)
	}

	@Patch(':id')
	@Roles(Role.ADMIN)
	update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
		return this.storesService.update(+id, updateStoreDto)
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	remove(@Param('id') id: string) {
		return this.storesService.remove(+id)
	}
}
