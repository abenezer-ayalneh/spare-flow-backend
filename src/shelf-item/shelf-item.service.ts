import { Injectable } from '@nestjs/common'

import { UpdateQuantityDto } from '../items/dto/update-quantity.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ShelfItemService {
	constructor(private readonly prismaService: PrismaService) {}

	incrementQuantity(shelfItemId: number, updateQuantityDto: UpdateQuantityDto) {
		return this.prismaService.shelfItem.update({
			where: {
				id: shelfItemId,
			},
			data: {
				quantity: {
					increment: updateQuantityDto.quantity,
				},
			},
			select: {
				id: true,
				quantity: true,
				Item: { select: { id: true, name: true, price: true, source: true, description: true, partNumber: true } },
				ShelfLocation: { select: { id: true, name: true, Store: { select: { id: true, name: true } } } },
			},
		})
	}

	decrementQuantity(shelfItemId: number, updateQuantityDto: UpdateQuantityDto) {
		return this.prismaService.shelfItem.update({
			where: {
				id: shelfItemId,
			},
			data: {
				quantity: {
					decrement: updateQuantityDto.quantity,
				},
			},
			select: {
				id: true,
				quantity: true,
				Item: { select: { id: true, name: true, price: true, source: true, description: true, partNumber: true } },
				ShelfLocation: { select: { id: true, name: true, Store: { select: { id: true, name: true } } } },
			},
		})
	}
}
