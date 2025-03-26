import { Module } from '@nestjs/common'

import { TransactionLogListener } from './listeners/transaction-log.listener'
import { TransactionLogController } from './transaction-log.controller'
import { TransactionLogService } from './transaction-log.service'

@Module({
	providers: [TransactionLogService, TransactionLogListener],
	controllers: [TransactionLogController],
})
export class TransactionLogModule {}
