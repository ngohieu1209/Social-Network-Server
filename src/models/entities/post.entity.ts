import { PostMode } from './../../shares/enums/postMode.enum';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
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
  postMode: PostMode;

  @Column()
  @Expose()
  content: string;

  @Column()
  @Expose()
  hashtag: string;

  @Column()
  @Expose()
  image: string;

  @Column()
  @Expose()
  video: string;

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

  @ManyToOne(() => UsersEntity, (user) => user.posts)
  userId: UsersEntity;
}
