import { FriendStatus } from './../../shares/enums/friendStatus.enum';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({
  name: 'friends',
})
export class FriendsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Expose()
  user_send_request: string;

  @Column({ nullable: false })
  @Expose()
  user_receive_request: string;

  @Column({
    type: 'enum',
    enum: FriendStatus,
    default: FriendStatus.FOLLOW,
  })
  @Expose()
  status: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;
}
