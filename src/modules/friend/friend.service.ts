import { FriendsRepository, UserRepository } from './../../models/repositories';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendsRepository)
    private readonly friendsRepository: FriendsRepository,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}
  async requestFriend(currentUserId: string, userId: string) {
    if (currentUserId === userId) {
      return { msg: 'You can not send a friend request to yourself' };
    }
    const friend = await this.friendsRepository.findOne({
      where: { user_send_request: currentUserId, user_receive_request: userId },
    });
    if (!friend) {
      await this.friendsRepository.save({
        user_send_request: currentUserId,
        user_receive_request: userId,
      });
      const userReceive = await this.userRepository.findOne(userId);
      userReceive.followers += 1;
      await this.userRepository.save(userReceive);

      const userSend = await this.userRepository.findOne(currentUserId);
      userSend.following += 1;
      await this.userRepository.save(userSend);
      return { msg: 'Send a friend request success' };
    }
    return { msg: 'You have sent a friend request' };
  }

  async acceptFriend(currentUserId: string, userId: string) {
    const friend = await this.friendsRepository.findOne({
      where: { user_send_request: userId, user_receive_request: currentUserId },
    });
    if (!friend) {
      return { msg: 'Friend request not found' };
    }
    await this.friendsRepository.save({
      ...friend,
      status: 'friend',
    });

    const currentUser = await this.userRepository.findOne(currentUserId);
    currentUser.following += 1;
    await this.userRepository.save(currentUser);

    const user = await this.userRepository.findOne(userId);
    user.followers += 1;
    await this.userRepository.save(user);

    return { msg: 'Have become friends' };
  }

  async listRequestFriend(currentUserId: string, page: number) {
    return await this.friendsRepository.getListRequestFriend(
      currentUserId,
      page,
    );
  }

  async listFriend(currentUserId: string, page: number) {
    return await this.friendsRepository.getListInfoFriends(currentUserId, page);
  }

  async deleteFriend(currentUserId: string, userId: string) {
    const friend = await this.friendsRepository.findOne({
      where: [
        { user_send_request: userId, user_receive_request: currentUserId },
        { user_send_request: currentUserId, user_receive_request: userId },
      ],
    });
    if (!friend) {
      return { msg: 'Friend request not found' };
    }
    await this.friendsRepository.delete(friend.id);
    const currentUser = await this.userRepository.findOne(currentUserId);
    const user = await this.userRepository.findOne(userId);

    if (friend.status === 'friend') {
      await this.userRepository.save({
        ...currentUser,
        following: currentUser.following - 1,
        followers: currentUser.followers - 1,
      });
      await this.userRepository.save({
        ...user,
        following: user.following - 1,
        followers: user.followers - 1,
      });
    } else if (friend.status === 'follow') {
      if (friend.user_send_request === currentUserId) {
        await this.userRepository.save({
          ...currentUser,
          following: currentUser.following - 1,
        });
        await this.userRepository.save({
          ...user,
          followers: user.followers - 1,
        });
      } else {
        await this.userRepository.save({
          ...currentUser,
          followers: currentUser.followers - 1,
        });
        await this.userRepository.save({
          ...user,
          following: user.following - 1,
        });
      }
    }
    return { msg: 'Delete friend success' };
  }

  async checkFriend(currentUserId: string, userId: string) {
    const friend = await this.friendsRepository.findOne({
      where: [
        { user_send_request: userId, user_receive_request: currentUserId },
        { user_send_request: currentUserId, user_receive_request: userId },
      ],
    });
    if (!friend) {
      return null;
    }
    if (friend.status === 'friend') {
      return 'friend';
    } else if (friend.status === 'follow') {
      if (friend.user_send_request === currentUserId) {
        return 'following';
      } else {
        return 'followers';
      }
    }
  }
}
