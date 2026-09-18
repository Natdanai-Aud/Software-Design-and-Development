import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as loadEnv } from 'dotenv';
import * as path from 'path';
import { AppModule } from './app.module';

loadEnv({ path: path.resolve(process.cwd(), '..', '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('BKK Data Base API')
    .setDescription('BKK Data Base API v0.2.0 - In-Memory Mock Backend')
    .setVersion('0.2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'bearer',
        description: 'Admin access via ADMIN_MOCK_TOKEN (mock backend)',
      },
      'bearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger-json',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
