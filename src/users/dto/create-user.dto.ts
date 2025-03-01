import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator'

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

	@MinLength(4)
	@IsNotEmpty()
	password: string

	@MinLength(4)
	@IsNotEmpty()
	confirmPassword: string

	@IsBoolean()
	@IsOptional()
	active?: boolean
}
