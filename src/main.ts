import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const serverConfig = config.get('server');
  const { port, origin } = serverConfig;

  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
  // enabling all cors
  app.enableCors();
  } else {
    app.enableCors({ origin });
  }

  const appPort = process.env.PORT || port;

  await app.listen(appPort);

  logger.log(`Application listening on port ${appPort}`);
}
bootstrap();
