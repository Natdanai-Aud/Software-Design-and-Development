import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { getPort, loadRepoEnv } from './config/env';

loadRepoEnv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  await app.listen(getPort());
}

bootstrap();
