import { Connection } from 'typeorm';
import Post, { IPostData } from '../entity/Post';
import { IDefaultData } from '../entity/utils';


export default class PostsService {

  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async findPosts(q?: string): Promise<(IPostData & IDefaultData)[]> {

    const results = await this.connection
      .getRepository(Post)
      .createQueryBuilder('post')
      .where(
        'post.author LIKE :q OR post.title LIKE :q',
        { q: `%${q ? q : ''}%` })
      .orderBy('LENGTH(post.content)', 'ASC')
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

  async update(id: number, values: Pick<IPostData, 'title' | 'content'>): Promise<void> {
    await this.connection
      .createQueryBuilder()
      .update(Post)
      .set(values)
      .where('id = :id', { id })
      .execute();
  }

  async delete(id: number): Promise<void> {
    await this.connection
      .createQueryBuilder()
      .delete()
      .from(Post)
      .where('id = :id', { id })
      .execute();
  }
}
