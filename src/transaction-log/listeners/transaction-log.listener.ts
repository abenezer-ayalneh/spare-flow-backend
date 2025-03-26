import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { TransactionLogEvent } from '../events/transaction-log.event'
import { TransactionLogService } from '../transaction-log.service'

@Injectable()
export class TransactionLogListener {
	constructor(private readonly transactionLogService: TransactionLogService) {}

	@OnEvent('transaction.log')
	async handleOrderCreatedEvent(transactionLogEvents: TransactionLogEvent[]) {
		await this.transactionLogService.createTransactionLogFromEvents(transactionLogEvents)
	}
}
