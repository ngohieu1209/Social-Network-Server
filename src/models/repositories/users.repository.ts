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
}
