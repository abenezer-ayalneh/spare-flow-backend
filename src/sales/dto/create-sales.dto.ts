import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateSalesDto {
	@IsString()
	@IsNotEmpty()
	clientName: string

	@IsNumber()
	@IsNotEmpty()
	itemId: number

	@IsNumber()
	@IsNotEmpty()
	quantity: number
}
