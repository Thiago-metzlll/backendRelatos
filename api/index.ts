import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import cookieParser from 'cookie-parser';

let cachedServer: express.Express;

export const createServer = async () => {
  if (cachedServer) return cachedServer;

  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
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
  cachedServer = expressApp;
  return expressApp;
};

// Vercel entry point
export default async (req: any, res: any) => {
  const serverInstance = await createServer();
  serverInstance(req, res);
};
