import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'multer';

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

	const port = process.env.PORT || 4200;
	await app.listen(port);

	Logger.log(
		`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
		'NestApplication'
	);
}

bootstrap();
