import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export default class SignInDto {
	@IsString()
	@IsNotEmpty()
	username: string

	@MinLength(4)
	password: string
}
