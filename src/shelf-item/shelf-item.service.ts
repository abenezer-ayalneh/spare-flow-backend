import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { TransactionType } from '@prisma/client'

import { UpdateQuantityDto } from '../items/dto/update-quantity.dto'
import { PrismaService } from '../prisma/prisma.service'
import { TransactionLogEvent } from '../transaction-log/events/transaction-log.event'

@Injectable()
export class ShelfItemService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async incrementQuantity(userId: number, shelfItemId: number, updateQuantityDto: UpdateQuantityDto) {
		const updatedShelfItem = await this.prismaService.shelfItem.update({
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

		this.eventEmitter.emit('transaction.log', [
			new TransactionLogEvent(userId, updatedShelfItem.Item.id, updateQuantityDto.quantity, TransactionType.CREDIT),
		])

		return updatedShelfItem
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
