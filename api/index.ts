import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import cookieParser from 'cookie-parser';

const server = express();

export const createServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

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

  await app.init();
  return app;
};

// Vercel entry point
export default async (req: any, res: any) => {
  await createServer(server);
  server(req, res);
};
