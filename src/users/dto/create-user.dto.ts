import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator'

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	username: string

	@IsPhoneNumber('ET')
	@IsString()
	@IsNotEmpty()
	phoneNumber: string

	@IsNumber()
	@IsNotEmpty()
	roleId: number
}
