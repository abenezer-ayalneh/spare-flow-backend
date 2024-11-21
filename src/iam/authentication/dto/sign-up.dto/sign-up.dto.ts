import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, MinLength } from 'class-validator'

export default class SignUpDto {
	@MinLength(3)
	@IsString()
	@IsNotEmpty()
	name: string

	@MinLength(3)
	@IsString()
	@IsNotEmpty()
	username: string

	@IsPhoneNumber('ET')
	@IsNotEmpty()
	phoneNumber: string

	@MinLength(4)
	@IsNotEmpty()
	password: string

	@MinLength(4)
	@IsNotEmpty()
	confirmPassword: string

	@IsNumber()
	@IsNotEmpty()
	roleId: number
}
