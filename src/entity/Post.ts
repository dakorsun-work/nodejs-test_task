
/* eslint-disable import/no-cycle */
import {
  Column,
  Entity,
} from 'typeorm';
import { DefaultEntity } from './utils';

@Entity()
// @TableInheritance({ column: { name: 'role', enum: UserRoles } })
export default abstract class Post extends DefaultEntity {
  @Column({ type: 'varchar', length: 30 })
    author: string;
  @Column({ type: 'varchar', length: 30 })
    title: string;
  @Column({ type: 'varchar', length: 1000 })
    content: string;
}
