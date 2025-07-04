import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateShelfDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsOptional()
	description?: string

	@IsNumber()
	@IsNotEmpty()
	storeId: number
}
