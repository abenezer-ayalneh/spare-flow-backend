import { IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateQuantityDto {
	@IsNumber()
	@IsNotEmpty()
	quantity: number
}
