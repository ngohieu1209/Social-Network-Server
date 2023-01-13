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
  userSend: string;

  @Column({ nullable: false })
  @Expose()
  userReceive: string;

  @Column({
    type: 'enum',
    enum: FriendStatus,
    default: FriendStatus.STRANGER,
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
