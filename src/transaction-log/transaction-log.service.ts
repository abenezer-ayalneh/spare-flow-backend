import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { TransactionLogEvent } from './events/transaction-log.event'

@Injectable()
export class TransactionLogService {
	constructor(private readonly prismaService: PrismaService) {}

	fetchAll() {
		return this.prismaService.transactionLog.findMany({
			select: {
				id: true,
				quantity: true,
				remainingQuantity: true,
				type: true,
				createdAt: true,
				Item: {
					select: {
						id: true,
						name: true,
						partNumber: true,
						price: true,
						source: true,
					},
				},
				ResponsibleUser: {
					select: {
						id: true,
						name: true,
						username: true,
					},
				},
			},
		})
	}

	async createTransactionLogFromEvents(transactionLogEvents: TransactionLogEvent[]) {
		const itemIds = transactionLogEvents.map((transactionLogEvent) => transactionLogEvent.itemId)

		const shelfItems = await this.prismaService.shelfItem.findMany({
			where: {
				itemId: {
					in: itemIds,
				},
			},
		})

		const transactionLogPayload: (TransactionLogEvent & { remainingQuantity: number })[] = transactionLogEvents.map((transactionLogEvent) => ({
			...transactionLogEvent,
			remainingQuantity: shelfItems
				.filter((shelfItem) => shelfItem.itemId === transactionLogEvent.itemId)
				.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0),
		}))

		await this.prismaService.transactionLog.createMany({
			data: transactionLogPayload,
		})
	}
}
