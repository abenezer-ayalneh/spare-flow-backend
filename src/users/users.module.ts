import { Module } from '@nestjs/common'

import BcryptService from '../iam/hashing/bcrypt.service'
import HashingService from '../iam/hashing/hashing.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	controllers: [UsersController],
	providers: [
		UsersService,
		{
			provide: HashingService,
			useClass: BcryptService,
		},
	],
})
export class UsersModule {}
