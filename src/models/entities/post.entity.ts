import { PostMode } from './../../shares/enums/postMode.enum';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({
  name: 'post',
})
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PostMode,
    default: PostMode.PUBLIC,
  })
  @Expose()
  postMode: string;

  @Column()
  @Expose()
  content: string;

  @Column()
  @Expose()
  likesCount: number;

  @Column()
  @Expose()
  commentsCount: number;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @Column()
  userId: string;
}
