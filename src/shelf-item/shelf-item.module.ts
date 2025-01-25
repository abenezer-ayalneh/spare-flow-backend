import { Module } from '@nestjs/common'

import { ShelfItemController } from './shelf-item.controller'
import { ShelfItemService } from './shelf-item.service'

@Module({
	controllers: [ShelfItemController],
	providers: [ShelfItemService],
})
export class ShelfItemModule {}
