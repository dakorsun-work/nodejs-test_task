import { Router } from 'express';
import { getPosts } from './controller';

const postsRouter = Router();

postsRouter.get('/', getPosts);

postsRouter.post('/', (req, res) => {
  // todo tbd
  res.sendStatus(200);
});

postsRouter.put('/:id', (req, res) => {
  // todo tbd
  res.sendStatus(200);
});

postsRouter.delete('/:id', (req, res) => {
  // todo tbd
  res.sendStatus(200);
});

export default postsRouter;