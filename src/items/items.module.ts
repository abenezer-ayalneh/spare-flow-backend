import { Module } from '@nestjs/common'

import { ItemsController } from './items.controller'
import { ItemsService } from './items.service'

@Module({
	controllers: [ItemsController],
	providers: [ItemsService],
	exports: [ItemsService],
})
export class ItemsModule {}
