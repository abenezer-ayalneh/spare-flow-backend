import { Module } from '@nestjs/common'

import { ItemsModule } from '../items/items.module'
import { SalesController } from './sales.controller'
import { SalesService } from './sales.service'

@Module({
	imports: [ItemsModule],
	controllers: [SalesController],
	providers: [SalesService],
})
export class SalesModule {}
