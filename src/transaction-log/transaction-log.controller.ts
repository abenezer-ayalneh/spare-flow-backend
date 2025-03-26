import { Controller, Get } from '@nestjs/common'

import { Roles } from '../roles/decorators/roles.decorator'
import { Role } from '../roles/types/roles.type'
import { TransactionLogService } from './transaction-log.service'

@Controller('transaction-log')
export class TransactionLogController {
	constructor(private readonly transactionLogService: TransactionLogService) {}

	@Get()
	@Roles(Role.ADMIN)
	fetchAll() {
		return this.transactionLogService.fetchAll()
	}
}
