import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: '*',
    allowedHeaders: ['authorization'],
  });
  app.use(compression());
  app.use(helmet());
  if (configService.get('NODE_ENV') === 'PRODUCTION') {
    app.use(
      rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minutes
        max: 60, // limit each IP to 60 requests per windowMs
      })
    );
  }
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
