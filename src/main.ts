import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [
      'http://localhost:5173',
      'https://front-relatos-two.vercel.app',
      'https://front-relatos-2fw7.vercel.app',
      'https://front-relatos-2fw7-iila76x4c-thiagos-projects-1de5c76e.vercel.app',
    ];

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
