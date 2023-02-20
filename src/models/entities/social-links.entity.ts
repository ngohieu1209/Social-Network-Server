import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: false })
  @Expose()
  userId: string;
}
