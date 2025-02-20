import { Body, Controller, NotFoundException, Post } from '@nestjs/common'

import ActiveUser from '../iam/decorators/active-user.decorator'
import { ItemsService } from '../items/items.service'
import { Roles } from '../roles/decorators/roles.decorator'
import { Role } from '../roles/types/roles.type'
import { CreateSalesDto } from './dto/create-sales.dto'
import { SalesService } from './sales.service'

@Controller('sales')
export class SalesController {
	constructor(
		private readonly salesService: SalesService,
		private readonly itemService: ItemsService,
	) {}

	@Post()
	@Roles(Role.ADMIN, Role.SALES)
	async createSales(@ActiveUser('sub') userId: number, @Body() createSalesDto: CreateSalesDto) {
		// Check if the item with the provided item ID exists in the database
		const item = await this.itemService.findOne(createSalesDto.itemId)
		if (!item) {
			throw new NotFoundException('Item not found')
		}

		// Check if the requested quantity exists
		const quantityCheck = await this.salesService.checkQuantity(createSalesDto.itemId, createSalesDto.quantity)
		if (!quantityCheck) {
			throw new NotFoundException('Quantity overflow')
		}

		return this.salesService.createSales(item, Number(userId), createSalesDto)
	}
}
