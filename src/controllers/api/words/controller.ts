import { RequestHandler } from 'express';
import Joi from 'joi';
import WordsCounter from '../../../services/WordsCounter';
import redis from 'redis';
import PostsService from '../../../services/Posts';
import { getConnection } from 'typeorm';


const redisClient = redis.createClient();
redisClient.on('error', function (error) {
  console.error(error);
});


export const countParamsSchema = Joi.object({ count: Joi.number().optional() });

export const countWords: RequestHandler = async (req, res): Promise<void> => {
  try {
    const countParamsValidated = countParamsSchema.validate({ ...req.params, ...req.query });
    if (countParamsValidated.error) {
      res.status(400).send(countParamsValidated.error.message);
      return;
    }
    const wordsCounter = new WordsCounter(redisClient);
    const contents = await new PostsService(getConnection()).findPosts();
    await wordsCounter.setContent(contents.map(content => ({
      id: content.id,
      content: content.content,
    })));
    await wordsCounter.mapContent();
    const words = await wordsCounter.getWordsCount(countParamsValidated.value.count);
    res.status(200).send(words);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
