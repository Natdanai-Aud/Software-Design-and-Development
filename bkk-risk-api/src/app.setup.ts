import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Shared app configuration (prefix, CORS, validation, Swagger) used by both
 * the real bootstrap (main.ts) and the e2e tests, so e2e coverage matches
 * the actual server exactly.
 */
export function configureApp(app: INestApplication): void {
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
}
