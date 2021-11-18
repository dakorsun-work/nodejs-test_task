import {
  CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity,
} from 'typeorm';

export abstract class DefaultEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;
  @CreateDateColumn()
    createdAt: Date;
  @UpdateDateColumn()
    updatedAt: Date;
}
