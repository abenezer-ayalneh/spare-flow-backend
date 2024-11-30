import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { WinstonModule } from 'nest-winston'

import { AppModule } from './app.module'
import winstonLoggerInstance from './utils/log/winston.log'

async function bootstrap() {
	// Logger to log stuff into console
	const logger = new Logger('Bootstrap')

	const app = await NestFactory.create(AppModule, {
		logger: WinstonModule.createLogger({ instance: winstonLoggerInstance }),
	})

	// Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
	app.use(helmet())

	// Get the configuration service
	const configService = app.get<ConfigService>(ConfigService)

	// Enable CORS from allowed origins listed in .env
	app.enableCors({
		origin: configService.get('CORS_ALLOWED_ORIGINS') ? configService.get('CORS_ALLOWED_ORIGINS').split(',') : false,
	})

	// Swagger for API documentation
	const swaggerConfig = new DocumentBuilder().setTitle('SpareFlow').setDescription('API Documentation').setVersion('1.0').build()
	const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('docs', app, documentFactory)

	await app.listen(configService.get('APP_PORT') ?? 3000, async () => logger.verbose(`Application running at ${await app.getUrl()}`))
}

bootstrap()
