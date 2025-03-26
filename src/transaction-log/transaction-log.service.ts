import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { TransactionLogEvent } from './events/transaction-log.event'

@Injectable()
export class TransactionLogService {
	constructor(private readonly prismaService: PrismaService) {}

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
