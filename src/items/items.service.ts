import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { TransactionType } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'
import { TransactionLogEvent } from '../transaction-log/events/transaction-log.event'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { UpdatePriceDto } from './dto/update-price.dto'

@Injectable()
export class ItemsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async create(userId: number, createItemDto: CreateItemDto) {
		const item = await this.prismaService.item.create({
			data: {
				name: createItemDto.name,
				price: createItemDto.price,
				source: createItemDto.source,
				description: createItemDto.description,
				partNumber: createItemDto.partNumber,
				ShelfItem: { create: { shelfLocationId: createItemDto.shelfId, quantity: createItemDto.quantity } },
			},
		})

		this.eventEmitter.emit('transaction.log', [new TransactionLogEvent(userId, item.id, createItemDto.quantity, TransactionType.CREDIT)])

		return item
	}

	findAll() {
		return this.prismaService.item.findMany({
			select: {
				id: true,
				name: true,
				price: true,
				source: true,
				description: true,
				partNumber: true,
				ShelfItem: {
					select: {
						id: true,
						quantity: true,
						ShelfLocation: { select: { id: true, name: true, Store: { select: { id: true, name: true } } } },
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	findMany(itemIds: number[]) {
		return this.prismaService.item.findMany({ where: { id: { in: itemIds } } })
	}

	findOne(id: number) {
		return this.prismaService.item.findUnique({ where: { id } })
	}

	update(id: number, updateItemDto: UpdateItemDto) {
		return this.prismaService.item.update({
			where: { id },
			data: {
				name: updateItemDto.name,
				partNumber: updateItemDto.partNumber,
				description: updateItemDto.description ?? undefined,
				source: updateItemDto.source,
				ShelfItem: {
					update: {
						where: {
							id: updateItemDto.shelfItemId,
						},
						data: {
							shelfLocationId: updateItemDto.shelfId,
						},
					},
				},
			},
		})
	}

	remove(id: number) {
		return this.prismaService.item.delete({ where: { id } })
	}

	getItemsList() {
		return this.prismaService.shelfItem.findMany({
			select: {
				id: true,
				quantity: true,
				Item: { select: { id: true, name: true, price: true, source: true, description: true, partNumber: true } },
				ShelfLocation: { select: { id: true, name: true, Store: { select: { id: true, name: true } } } },
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async checkShelfLocationInsideStore(shelfId: number, storeId: number) {
		const shelf = await this.prismaService.shelf.findUnique({ where: { id: shelfId } })

		if (!shelf) {
			throw new NotFoundException('No shelf found')
		}

		if (shelf.storeId !== storeId) {
			throw new ConflictException('Shelf and Store Mismatch')
		}

		return true
	}

	updatePrice(id: number, updatePriceDto: UpdatePriceDto) {
		return this.prismaService.item.update({
			where: { id },
			data: {
				price: updatePriceDto.price,
			},
		})
	}
}
