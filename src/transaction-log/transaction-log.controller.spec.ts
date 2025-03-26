import { Test, TestingModule } from '@nestjs/testing'

import { TransactionLogController } from './transaction-log.controller'

describe('TransactionLogController', () => {
	let controller: TransactionLogController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TransactionLogController],
		}).compile()

		controller = module.get<TransactionLogController>(TransactionLogController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
