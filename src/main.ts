import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173', // Frontend local (dev)
      'https://front-relatos-2fw7.vercel.app', // Frontend Vercel (prod)
      'https://front-relatos-two.vercel.app' // Novo Frontend Vercel
    ],
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
