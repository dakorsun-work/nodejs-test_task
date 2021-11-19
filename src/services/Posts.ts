import { Connection } from 'typeorm';
import Post, { IPostData } from '../entity/Post';


export default class PostsService {

  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async findPosts(q: string): Promise<IPostData[]> {

    const results = await this.connection
      .getRepository(Post)
      .createQueryBuilder('post')
      .where(
        'post.author LIKE :q OR post.title LIKE :q',
        { q: `%${q}%` })
      .getMany();

    return results.map((entity: Post) => (
      entity.getPostData()
    ));
  }

  async create({
    author, title, content,
  }: IPostData): Promise<void> {
    await this.connection
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({
        author,
        title,
        content,
      })
      .execute();
  }

}
