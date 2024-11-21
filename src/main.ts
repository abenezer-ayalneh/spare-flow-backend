import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { WinstonModule } from 'nest-winston'

import { AppModule } from './app.module'
import winstonLoggerInstance from './utils/log/winston.log'
import { Logger } from '@nestjs/common'

async function bootstrap() {
	// Logger to log stuff into console
	const logger = new Logger('Bootstrap')

	const app = await NestFactory.create(AppModule, {
		logger: WinstonModule.createLogger({ instance: winstonLoggerInstance }),
	})
	const configService = app.get<ConfigService>(ConfigService)

	await app.listen(configService.get('APP_PORT') ?? 3000, async () => logger.verbose(`Application running at ${await app.getUrl()}`))
}

bootstrap()
