import { Injectable, NotFoundException } from '@nestjs/common'
import { Item, SaleStatus } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'
import { CreateSalesDto } from './dto/create-sales.dto'

@Injectable()
export class SalesService {
	constructor(private readonly prismaService: PrismaService) {}

	async createSales(item: Item, userId: number, createSalesDto: CreateSalesDto) {
		await this.reduceFromStock(item.id, createSalesDto.quantity)

		return this.prismaService.sale.create({
			data: {
				clientName: createSalesDto.clientName,
				quantity: createSalesDto.quantity,
				price: createSalesDto.quantity * Number(item.price),
				status: SaleStatus.PENDING,
				Item: {
					connect: {
						id: createSalesDto.itemId,
					},
				},
				SalesPerson: {
					connect: {
						id: userId,
					},
				},
			},
		})
	}

	/**
	 * Check if the quantity of an item in stock is greater than the one requested
	 * @param itemId
	 * @param quantity
	 */
	async checkQuantity(itemId: number, quantity: number) {
		const totalQuantity = await this.getTotalQuantity(itemId)
		return totalQuantity > quantity
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
	 * @param itemId
	 * @param quantity
	 */
	async reduceFromStock(itemId: number, quantity: number) {
		let remainingQuantity = quantity
		const quantitiesToDecrement: Record<number, number> = {}

		const shelfItems = await this.prismaService.shelfItem.findMany({ where: { itemId } })

		for (const shelfItem of shelfItems) {
			quantitiesToDecrement[shelfItem.id] = Math.min(shelfItem.quantity, remainingQuantity)
			remainingQuantity -= Math.min(shelfItem.quantity, remainingQuantity)

			if (remainingQuantity === 0) {
				break
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
