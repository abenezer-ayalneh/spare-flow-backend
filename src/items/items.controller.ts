import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { UpdatePriceDto } from './dto/update-price.dto'
import { ItemsService } from './items.service'

@Controller('items')
export class ItemsController {
	constructor(private readonly itemsService: ItemsService) {}

	@Post()
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
	update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
		return this.itemsService.update(+id, updateItemDto)
	}

	@Patch(':id/price')
	updatePrice(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
		return this.itemsService.updatePrice(+id, updatePriceDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.itemsService.remove(+id)
	}
}
