/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as passport from 'passport';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use((req, res, next) => {
    console.log('Headers:', req.headers);
    next();
  });
  app.use(passport.initialize());

  await app.listen(process.env.PORT || 3000);
  console.log('Listening on', process.env.PORT || 3000);
}
bootstrap();
