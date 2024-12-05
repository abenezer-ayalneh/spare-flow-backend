import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

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

	@IsBoolean()
	@IsOptional()
	active?: boolean
}
