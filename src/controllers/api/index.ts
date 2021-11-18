import { Router } from 'express';
import postsRouter from './posts';
import wordsRouter from './words';

const apiRouter = Router();

apiRouter.use('/posts', postsRouter);
apiRouter.use('/words', wordsRouter);

export default apiRouter;
