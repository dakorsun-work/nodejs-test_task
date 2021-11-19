/* eslint-disable import/no-cycle */
import {
  Column,
  Entity,
} from 'typeorm';
import { DefaultEntity, IDefaultData } from './utils';

export interface IPostData {
  author: string,
  title: string,
  content: string
}

@Entity()
// @TableInheritance({ column: { name: 'role', enum: UserRoles } })
export default abstract class Post extends DefaultEntity {
  @Column({ type: 'varchar', length: 30 })
    author: string;

  @Column({ type: 'varchar', length: 30 })
    title: string;

  @Column({ type: 'varchar', length: 1000 })
    content: string;

  getPostData(): IPostData & IDefaultData {
    return Object.assign({}, {
      id: this.id,
      author: this.author,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
