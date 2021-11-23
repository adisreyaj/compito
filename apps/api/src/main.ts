import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3333;
  const configService: ConfigService = app.get(ConfigService);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const allowList = ['http://localhost:4200', 'https://compito.adi.so'];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('CORS: Not allowed'), false);
      }
    },
  });
  app.use(compression());
  app.use(helmet());
  if (configService.get('NODE_ENV', { infer: true }) === 'PRODUCTION') {
    app.use(
      rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minutes
        max: 60, // limit each IP to 60 requests per windowMs
      }),
    );
  }
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap().catch((err) => console.error(err));
