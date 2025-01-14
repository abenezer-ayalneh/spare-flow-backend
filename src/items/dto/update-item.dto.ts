import { ItemSource } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateItemDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	partNumber: string

	@IsString()
	@IsOptional()
	description?: string

	@IsEnum(ItemSource)
	@IsNotEmpty()
	source: ItemSource

	@IsNumber()
	@IsNotEmpty()
	storeId: number

	@IsNumber()
	@IsNotEmpty()
	shelfId: number

	@IsNumber()
	@IsNotEmpty()
	shelfItemId: number
}
