import { TransactionType } from '@prisma/client'

export class TransactionLogEvent {
	constructor(
		public userId: number,
		public itemId: number,
		public quantity: number,
		public type: TransactionType,
	) {}
}
