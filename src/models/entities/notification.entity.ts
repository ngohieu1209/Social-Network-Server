import { ActionStatus } from './../../shares/enums/actionStatus.enum';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({
  name: 'notification',
})
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Expose()
  recipient: string;

  @Column({ nullable: false })
  @Expose()
  sender: string;

  @Column({
    type: 'enum',
    enum: ActionStatus,
    nullable: false,
  })
  @Expose()
  action: string;

  @Column({
    type: 'int',
    default: 0,
  })
  @Expose()
  seen: number;

  @Column({ nullable: false })
  @Expose()
  postId: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;
}
