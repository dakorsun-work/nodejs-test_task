import { RedisClient } from 'redis';
import { promisify } from 'util';


export default class RedisService {

  client: RedisClient;

  exists: (arg1: string) => Promise<boolean>;

  get: (arg1: string) => Promise<string | null>;

  set: (arg1: string, arg2: string) => Promise<void>;

  keys: (arg1: string) => Promise<string[]>;

  incrby: (arg1: string, arg2: number) => Promise<number>;

  flushall: (arg1?: 'ASYNC') => Promise<string>;

  constructor(client: RedisClient){
    this.client = client;
    this.exists = promisify(this.client.exists).bind(this.client);
    this.get = promisify(this.client.get).bind(this.client);
    this.set = promisify(this.client.set).bind(this.client);
    this.keys = promisify(this.client.keys).bind(this.client);
    this.incrby = promisify(this.client.incrby).bind(this.client);
    this.flushall = promisify(this.client.flushall).bind(this.client);
  }
}
