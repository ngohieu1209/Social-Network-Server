import { UsersEntity } from '../entities/users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  async findUserByEmail(email: string): Promise<UsersEntity> {
    const user = await this.createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .addSelect('user.password')
      .getOne();
    if (user) return user;
    else return null;
  }

  async findUserById(id: string) {
    const user = await this.createQueryBuilder('user')
      .leftJoinAndMapOne(
        'user.avatar',
        'upload',
        'upload',
        'user.avatar = upload.id',
      )
      .leftJoinAndMapOne(
        'user.links',
        'socialLinks',
        'socialLinks',
        'user.id = socialLinks.userId',
      )
      .where('user.id = :id', { id: id })
      .select([
        'user',
        'upload.public_id',
        'upload.file',
        'upload.fileType',
        'upload.url',
        'socialLinks',
      ])
      .getOne();
    if (user) return user;
    else return null;
  }
}
