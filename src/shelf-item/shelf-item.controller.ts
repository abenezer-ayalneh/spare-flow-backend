import { Body, Controller, Param, Patch } from '@nestjs/common'

import ActiveUser from '../iam/decorators/active-user.decorator'
import { UpdateQuantityDto } from '../items/dto/update-quantity.dto'
import { Roles } from '../roles/decorators/roles.decorator'
import { Role } from '../roles/types/roles.type'
import { ShelfItemService } from './shelf-item.service'

@Controller('shelf-item')
export class ShelfItemController {
	constructor(private readonly shelfItemService: ShelfItemService) {}

	@Patch(':id/quantity')
	@Roles(Role.ADMIN, Role.SALES)
	updateQuantity(@ActiveUser('sub') userId: number, @Param('id') id: string, @Body() updateQuantityDto: UpdateQuantityDto) {
		return this.shelfItemService.incrementQuantity(userId, +id, updateQuantityDto)
	}
}
