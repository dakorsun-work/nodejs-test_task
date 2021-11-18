import { Router } from 'express';

const postsRouter = Router();

postsRouter.get('/', (req, res) => {
  // todo tbd
  res.sendStatus(200);
});

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
