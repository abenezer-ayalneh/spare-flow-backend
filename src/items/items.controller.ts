import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { Auth } from '../iam/authentication/decorators/auth.decorator'
import AuthType from '../iam/authentication/enums/auth-type.enum'
import { Roles } from '../roles/decorators/roles.decorator'
import { Role } from '../roles/types/roles.type'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { UpdatePriceDto } from './dto/update-price.dto'
import { ItemsService } from './items.service'

@Auth(AuthType.Bearer)
@Controller('items')
export class ItemsController {
	constructor(private readonly itemsService: ItemsService) {}

	@Post()
	@Roles(Role.ADMIN)
	async create(@Body() createItemDto: CreateItemDto) {
		await this.itemsService.checkShelfLocationInsideStore(createItemDto.shelfId, createItemDto.storeId)

		return this.itemsService.create(createItemDto)
	}

	@Get()
	findAll() {
		return this.itemsService.findAll()
	}

	@Get('list')
	getItemsList() {
		return this.itemsService.getItemsList()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.itemsService.findOne(+id)
	}

	@Patch(':id')
	@Roles(Role.ADMIN, Role.SALES)
	update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
		return this.itemsService.update(+id, updateItemDto)
	}

	@Patch(':id/price')
	@Roles(Role.ADMIN)
	updatePrice(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
		return this.itemsService.updatePrice(+id, updatePriceDto)
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	remove(@Param('id') id: string) {
		return this.itemsService.remove(+id)
	}
}
