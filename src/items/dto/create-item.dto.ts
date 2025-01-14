import { ItemSource } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateItemDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	partNumber: string

	@IsString()
	@IsOptional()
	description?: string

	@IsNumber()
	@IsNotEmpty()
	price: number

	@IsEnum(ItemSource)
	@IsNotEmpty()
	source: ItemSource

	@IsNumber()
	@IsNotEmpty()
	quantity: number

	@IsNumber()
	@IsNotEmpty()
	storeId: number

	@IsNumber()
	@IsNotEmpty()
	shelfId: number
}
