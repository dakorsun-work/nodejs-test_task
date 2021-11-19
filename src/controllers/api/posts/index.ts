import { Router } from 'express';
import { createPost, deletePost, getPosts, updatePost } from './controller';

const postsRouter = Router();

postsRouter.get('/', getPosts);

postsRouter.post('/', createPost);

postsRouter.put('/:id', updatePost);

postsRouter.delete('/:id', deletePost);

export default postsRouter;
