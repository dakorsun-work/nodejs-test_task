import { RequestHandler } from 'express';
import PostsService from '../../../services/Posts';
import { getConnection } from 'typeorm';
import Joi from 'joi';
import { onlyLatinValidator } from '../../utils';

export const queryObjectSchema = Joi.object({ query: Joi.string().optional() });
export const createPostSchema = Joi.object({
  author: onlyLatinValidator.min(1).max(30),
  title: Joi.string().required().min(1).max(30),
  content: Joi.string().required().min(1).max(1000),
});

export const getPosts: RequestHandler = async (req, res): Promise<void> => {
  try {
    const queryObjectValidated = queryObjectSchema.validate(req.query);
    if (queryObjectValidated.error) {
      res.status(400).send(queryObjectValidated.error.message);
      return;
    }
    const queryString: string = queryObjectValidated.value.query;

    const posts = await new PostsService(getConnection()).findPosts(queryString);

    res.status(200).send(posts);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const createPost: RequestHandler = async (req, res) => {
  try {
    const postToCreateValidated = createPostSchema.validate(req.body);
    if (postToCreateValidated.error) {
      res.status(400).send(postToCreateValidated.error.message);
      return;
    }
    await new PostsService(getConnection()).create(postToCreateValidated.value);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
