import { Test, TestingModule } from '@nestjs/testing'

import { ShelfItemController } from './shelf-item.controller'
import { ShelfItemService } from './shelf-item.service'

describe('ShelfItemController', () => {
	let controller: ShelfItemController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ShelfItemController],
			providers: [ShelfItemService],
		}).compile()

		controller = module.get<ShelfItemController>(ShelfItemController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
