import { Body, Controller, Param, Patch } from '@nestjs/common'

import { UpdateQuantityDto } from '../items/dto/update-quantity.dto'
import { ShelfItemService } from './shelf-item.service'

@Controller('shelf-item')
export class ShelfItemController {
	constructor(private readonly shelfItemService: ShelfItemService) {}

	@Patch(':id/quantity')
	updateQuantity(@Param('id') id: string, @Body() updateQuantityDto: UpdateQuantityDto) {
		return this.shelfItemService.incrementQuantity(+id, updateQuantityDto)
	}
}
