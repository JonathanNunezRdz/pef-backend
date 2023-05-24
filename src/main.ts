import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import 'multer';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		})
	);
	app.enableCors();

	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);
	app.use(json({ limit: '20mb' }));

	const port = process.env.PORT || 4200;
	await app.listen(port);

	Logger.log(
		`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
		'NestApplication'
	);
}

bootstrap();
