import { EntityRepository, Repository } from 'typeorm';
import { FriendsEntity } from '../entities';

const perPage = 10;

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

  async getListRequestFriend(userId: string, page: number) {
    const listFollow = await this.createQueryBuilder('friends')
      .innerJoinAndMapOne(
        'friends.user_send_request',
        'users',
        'user',
        'user.id = friends.user_send_request',
      )
      .leftJoinAndMapOne(
        'user.avatar',
        'upload',
        'avatar',
        'user.avatar = avatar.id',
      )
      .where('friends.user_receive_request = :userId', { userId })
      .andWhere('friends.status = :status', { status: 'follow' })
      .select([
        'friends',
        'user.id',
        'user.avatar',
        'avatar.url',
        'user.firstName',
        'user.lastName',
        'user.location',
      ])
      .offset((page - 1) * perPage)
      .limit(perPage)
      .orderBy('friends.createdAt', 'DESC')
      .getManyAndCount();
    if (listFollow)
      return {
        data: listFollow[0],
        page: page,
        totalPages: Math.ceil(listFollow[1] / perPage),
      };
    else return null;
  }

  async getListInfoFriends(userId: string, page: number) {
    const listFriend = await this.createQueryBuilder('friends')
      .innerJoinAndMapOne(
        'friends.user_send_request',
        'users',
        'user_send',
        'user_send.id = friends.user_send_request',
      )
      .innerJoinAndMapOne(
        'friends.user_receive_request',
        'users',
        'user_receive',
        'user_receive.id = friends.user_receive_request',
      )
      .leftJoinAndMapOne(
        'user_send.avatar',
        'upload',
        'avatar_user_send',
        'user_send.avatar = avatar_user_send.id',
      )
      .leftJoinAndMapOne(
        'user_receive.avatar',
        'upload',
        'avatar_user_receive',
        'user_receive.avatar = avatar_user_receive.id',
      )
      .where('friends.user_receive_request = :userId', { userId })
      .andWhere('friends.status = :status', { status: 'friend' })
      .orWhere('friends.user_send_request = :userId', { userId })
      .andWhere('friends.status = :status', { status: 'friend' })
      .select([
        'friends',
        'user_send.id',
        'user_send.avatar',
        'avatar_user_send.url',
        'user_send.firstName',
        'user_send.lastName',
        'user_send.location',

        'user_receive.id',
        'user_receive.avatar',
        'avatar_user_receive.url',
        'user_receive.firstName',
        'user_receive.lastName',
        'user_receive.location',
      ])
      .offset((page - 1) * perPage)
      .limit(perPage)
      .orderBy('friends.createdAt', 'DESC')
      .getManyAndCount();
    if (listFriend)
      return {
        data: listFriend[0],
        page: page,
        totalPages: Math.ceil(listFriend[1] / perPage),
      };
    else return null;
  }
}
