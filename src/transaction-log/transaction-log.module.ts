import { Module } from '@nestjs/common'

import { TransactionLogListener } from './listeners/transaction-log.listener'
import { TransactionLogService } from './transaction-log.service'

@Module({
	providers: [TransactionLogService, TransactionLogListener],
})
export class TransactionLogModule {}
