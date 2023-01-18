import { EntityRepository, Repository } from 'typeorm';
import { FriendsEntity } from '../entities';

@EntityRepository(FriendsEntity)
export class FriendsRepository extends Repository<FriendsEntity> {
  async getStatusFriend(userSend: string, userReceive: string) {
    const friend = await this.createQueryBuilder('friends')
      .where('friends.user_send_request = :userSend', {
        userSend,
      })
      .andWhere('friends.user_receive_request = :userReceive', {
        userReceive,
      })
      .select('friends.status')
      .getOne();
    if (friend) return friend.status;
    else return null;
  }

  async getListFriends(userId: string) {
    const listFriends = await this.createQueryBuilder('friends')
      .where('friends.user_send_request = :userId', { userId })
      .andWhere('friends.status = :status', { status: 'friend' })
      .orWhere('friends.user_receive_request = :userId', { userId })
      .andWhere('friends.status = :status', { status: 'friend' })
      .select('*')
      .execute();
    if (listFriends) return listFriends;
    else return null;
  }

  async getListFollowing(userId: string) {
    const listFollowing = await this.createQueryBuilder('friends')
      .where('friends.user_send_request = :userId', { userId })
      .andWhere('friends.status = :status', { status: 'follow' })
      .select('*')
      .execute();
    if (listFollowing) return listFollowing;
    else return null;
  }
}
