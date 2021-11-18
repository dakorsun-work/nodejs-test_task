import express, { Application, Router } from 'express';
import apiRouter from '../controlles/api';

export default async (): Promise<Application> => {
  const app = express();

  const coreRouter = Router();

  coreRouter.use('/api', apiRouter);

  app.use('/', coreRouter);

  return app;
};
