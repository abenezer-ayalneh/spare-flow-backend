import { Test, TestingModule } from '@nestjs/testing'

import { ShelfItemService } from './shelf-item.service'

describe('ShelfItemService', () => {
	let service: ShelfItemService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ShelfItemService],
		}).compile()

		service = module.get<ShelfItemService>(ShelfItemService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
