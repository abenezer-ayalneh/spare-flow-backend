import { CacheModule } from '@nestjs/cache-manager'
import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { redisStore } from 'cache-manager-redis-yet'
import type { RedisClientOptions } from 'redis'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import IamModule from './iam/iam.module'
import { PrismaModule } from './prisma/prisma.module'
import GlobalExceptionFilter from './utils/filters/global-exception.filter'

@Module({
	imports: [
		ConfigModule.forRoot({}),
		CacheModule.registerAsync<RedisClientOptions>({
			isGlobal: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				store: await redisStore({
					url: config.get('REDIS_URL'),
				}),
			}),
		}),
		PrismaModule,
		IamModule,
	],
	controllers: [AppController],
	providers: [AppService, Logger, { provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}
