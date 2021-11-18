import { RequestHandler } from 'express';
import PostsService from '../../../services/Posts';
import { getConnection } from 'typeorm';
import Joi from 'joi';

export const queryObjectSchema = Joi.object({ query: Joi.string().optional() });

export const getPosts: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const queryObjectValidated = queryObjectSchema.validate(req.query);
    if (queryObjectValidated.error) {
      res.status(400).send(queryObjectValidated.error.message);
    }
    const queryString: string = queryObjectValidated.value.query;

    const posts = await new PostsService(getConnection()).findPosts(queryString);

    res.status(200).send(posts);
  } catch (e){
    res.status(500).send(e);
  }
  next();
};
