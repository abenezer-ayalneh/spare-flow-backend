import * as crypto from 'node:crypto'

import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Item, SaleStatus, TransactionType } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'
import { TransactionLogEvent } from '../transaction-log/events/transaction-log.event'
import { CreateSalesDto, ItemQuantityPair } from './dto/create-sales.dto'

@Injectable()
export class SalesService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async createSales(items: Item[], userId: number, createSalesDto: CreateSalesDto) {
		const transactionId = crypto.randomUUID()

		await this.reduceFromStock(createSalesDto.itemQuantityPairs)

		await this.prismaService.$transaction(
			createSalesDto.itemQuantityPairs.map((itemQuantityPair) =>
				this.prismaService.sale.create({
					data: {
						transactionId,
						clientName: createSalesDto.clientName,
						quantity: itemQuantityPair.quantity,
						price: itemQuantityPair.quantity * Number(items.find((item) => item.id === itemQuantityPair.itemId).price),
						status: SaleStatus.PENDING,
						Item: {
							connect: {
								id: itemQuantityPair.itemId,
							},
						},
						SalesPerson: {
							connect: {
								id: userId,
							},
						},
					},
				}),
			),
		)

		this.eventEmitter.emit(
			'transaction.log',
			createSalesDto.itemQuantityPairs.map(
				(itemQuantityPair) => new TransactionLogEvent(userId, itemQuantityPair.itemId, itemQuantityPair.quantity, TransactionType.DEBIT),
			),
		)

		return true
	}

	/**
	 * Check if the quantity of an item in stock is greater than the one requested
	 * @param itemId
	 * @param quantity
	 */
	async checkQuantity(itemId: number, quantity: number) {
		const totalQuantity = await this.getTotalQuantity(itemId)
		return totalQuantity >= quantity
	}

	/**
	 * Get the total quantity of an item in stock.
	 * @param itemId
	 */
	async getTotalQuantity(itemId: number) {
		const shelfItems = await this.prismaService.shelfItem.findMany({ where: { itemId } })

		if (shelfItems.length === 0) {
			throw new NotFoundException('Item not found in stock')
		}

		return shelfItems.reduce((prev, curr) => prev + curr.quantity, 0)
	}

	/**
	 * Find the item from the shelf-item table and decrement the provided quantity amount
	 * @param itemQuantityPairs
	 */
	async reduceFromStock(itemQuantityPairs: ItemQuantityPair[]) {
		const quantitiesToDecrement: Record<number, number> = {}

		for (const itemQuantityPair of itemQuantityPairs) {
			let remainingQuantity = itemQuantityPair.quantity
			const shelfItems = await this.prismaService.shelfItem.findMany({ where: { itemId: itemQuantityPair.itemId } })

			for (const shelfItem of shelfItems) {
				quantitiesToDecrement[shelfItem.id] = Math.min(shelfItem.quantity, remainingQuantity)
				remainingQuantity -= Math.min(shelfItem.quantity, remainingQuantity)

				if (remainingQuantity === 0) {
					break
				}
			}
		}

		await this.prismaService.$transaction(
			Object.entries(quantitiesToDecrement).map(([id, quantityToDecrement]) =>
				this.prismaService.shelfItem.update({
					where: { id: Number(id) },
					data: { quantity: { decrement: quantityToDecrement } },
				}),
			),
		)
	}
}
