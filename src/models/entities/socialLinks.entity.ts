import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity({
  name: 'socialLinks',
})
export class SocialLinksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Expose()
  linkFacebook: string;

  @Column()
  @Expose()
  linkInstagram: string;

  @Column()
  @Expose()
  linkGithub: string;

  @OneToOne(() => UsersEntity, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  userId: UsersEntity;
}
