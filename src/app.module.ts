import { CacheModule } from '@nestjs/cache-manager'
import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ThrottlerModule } from '@nestjs/throttler'
import { redisStore } from 'cache-manager-redis-yet'
import type { RedisClientOptions } from 'redis'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import IamModule from './iam/iam.module'
import { ItemsModule } from './items/items.module'
import { PrismaModule } from './prisma/prisma.module'
import { RolesModule } from './roles/roles.module'
import { SalesModule } from './sales/sales.module'
import { ShelfItemModule } from './shelf-item/shelf-item.module'
import { ShelvesModule } from './shelves/shelves.module'
import { StoresModule } from './stores/stores.module'
import { TransactionLogModule } from './transaction-log/transaction-log.module'
import { UsersModule } from './users/users.module'
import GlobalExceptionFilter from './utils/filters/global-exception.filter'

@Module({
	imports: [
		ConfigModule.forRoot({}),
		CacheModule.registerAsync<RedisClientOptions>({
			isGlobal: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				store: await redisStore({
					url: configService.get('REDIS_URL'),
				}),
			}),
		}),
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => [
				{
					ttl: configService.get('THROTTLER_TTL'),
					limit: configService.get('THROTTLER_LIMIT'),
				},
			],
		}),
		EventEmitterModule.forRoot(),
		PrismaModule,
		IamModule,
		UsersModule,
		RolesModule,
		ItemsModule,
		StoresModule,
		ShelvesModule,
		ShelfItemModule,
		SalesModule,
		TransactionLogModule,
	],
	controllers: [AppController],
	providers: [AppService, Logger, { provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}
