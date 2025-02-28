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
		const items = await this.itemService.findMany(createSalesDto.itemQuantityPairs.map((itemQuantityPair) => itemQuantityPair.itemId))
		if (items.length !== createSalesDto.itemQuantityPairs.length) {
			throw new NotFoundException('Missing items included')
		}

		// Check if the requested quantity exists
		for (const item of items) {
			const quantityCheck = await this.salesService.checkQuantity(
				item.id,
				createSalesDto.itemQuantityPairs.find((itemQuantityPair) => itemQuantityPair.itemId === item.id).quantity,
			)
			if (!quantityCheck) {
				throw new NotFoundException('Quantity overflow')
			}
		}

		return this.salesService.createSales(items, Number(userId), createSalesDto)
	}
}
