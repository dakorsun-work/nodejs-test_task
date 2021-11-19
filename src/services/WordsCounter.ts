import { RedisClient } from 'redis';
import RedisService from './RedisService';

interface IContentEntity {
  id: number;
  content: string;
}

interface IWordEntity {
  word: string;
  count: number;
}

interface IWordIncrementEntity {
  word: string;
  increment: number;
}

export enum IRKeyHeads {
  raw_content = 'RAW-CONTENT',
  word_counter = 'WORD_COUNTER',
}

export const getWordsArrayFromContent = (content: string): string[] => {
  return content.split(' ').map(word => {
    const result = word;
    if (word[word.length - 1] === '.') {
      return word.substring(0, word.length - 2);
    }
    return result;
  });
};

export const formatRawContentKeyName = (id: number) => `${IRKeyHeads.raw_content}-${id}`;
export const parseRawContentRawKeyName = (key: string) => key.split('-').reduce((acc, val, i) => {
  switch (i) {
    case 1:
      acc.id = val;
      return acc;
    default:
      return acc;
  }
}, Object.assign({}));

export const formatWordCounterKeyName = (word: string) => `${IRKeyHeads.word_counter}-${word}`;
export const parseWordCounterKeyName = (key: string) => key.split('-').reduce((acc, val, i) => {
  switch (i) {
    case 1:
      acc.word = val;
      return acc;
    default:
      return acc;
  }
}, Object.assign({}));


export default class WordsCounter {

  redisClient: RedisClient;

  constructor(redisClient: RedisClient) {
    this.redisClient = redisClient;
  }

  async setContent(contents: IContentEntity[]): Promise<void[]> {
    const redisService = new RedisService(this.redisClient);
    await redisService.flushall();
    return Promise.all(
      contents.map(
        async content => {
          const keyName = formatRawContentKeyName(content.id);
          await redisService.set(keyName, content.content);
        },
      ),
    );
  }

  async mapContent(): Promise<void[][]> {
    const redisService = new RedisService(this.redisClient);
    const words = await redisService.keys(`${IRKeyHeads.word_counter}-*`);
    const keys = await redisService.keys(`${IRKeyHeads.raw_content}-*`);

    await Promise.all(words.map(word => {
      return this.resetWordCount({ word }, redisService);
    }));
    return Promise.all(keys.map(async (raw_content_key): Promise<void[]> => {
      const content = await redisService.get(raw_content_key);
      const contentWords = getWordsArrayFromContent(content);
      const wordCounter = contentWords.reduce((counter_object: { [key: string]: number }, word) => {
        // eslint-disable-next-line no-prototype-builtins
        if (counter_object.hasOwnProperty(word)) {
          counter_object[word] = counter_object[word]++;
        } else {
          counter_object[word] = 1;
        }
        return counter_object;
      }, {});
      return Promise.all(Object.keys(wordCounter).map((key: string): Promise<void> => {
        return this.incrementWordCount({ word: key, increment: wordCounter[key] }, redisService);
      }));
    }));
  }

  async incrementWordCount({ word, increment }: IWordIncrementEntity, redisService?: RedisService): Promise<void> {
    const workingRedisService = redisService ? redisService : new RedisService(this.redisClient);

    await workingRedisService.incrby(formatWordCounterKeyName(word), increment);
  }

  async resetWordCount({ word }: Pick<IWordEntity, 'word'>, redisService?: RedisService): Promise<void> {
    const workingRedisService = redisService ? redisService : new RedisService(this.redisClient);

    return workingRedisService.set(formatWordCounterKeyName(word), '0');
  }

  async getWordsCount(countReq: number): Promise<IWordEntity[]> {
    const redisService = new RedisService(this.redisClient);
    const words = await redisService.keys(`${IRKeyHeads.word_counter}-*`);
    const wordsCounters = await Promise.all(words.map(async (word): Promise<IWordEntity> => {
      const count = await redisService.get(word);
      const parsedWordObj = parseWordCounterKeyName(word);
      return {
        ...parsedWordObj,
        count,
      };
    }));
    wordsCounters.sort((a, b) => (b.count - a.count));
    return wordsCounters.slice(0, countReq);
  }
}
