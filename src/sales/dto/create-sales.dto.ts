import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'

export class CreateSalesDto {
	@IsString()
	@IsNotEmpty()
	clientName: string

	@ValidateNested({ each: true })
	@Type(() => ItemQuantityPair)
	itemQuantityPairs: ItemQuantityPair[]
}

export class ItemQuantityPair {
	@IsNumber()
	@IsNotEmpty()
	itemId: number

	@IsNumber()
	@IsNotEmpty()
	quantity: number
}
