import { Router } from 'express';
import { createPost, getPosts, updatePost } from './controller';

const postsRouter = Router();

postsRouter.get('/', getPosts);

postsRouter.post('/', createPost);

postsRouter.put('/:id', updatePost);

postsRouter.delete('/:id', (req, res) => {
  // todo tbd
  res.sendStatus(200);
});

export default postsRouter;
