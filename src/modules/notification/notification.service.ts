import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  NotificationRepository,
  PostRepository,
} from './../../models/repositories';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/models/entities';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,

    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,

    private readonly usersService: UsersService,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const { recipient, sender, action, postId } = createNotificationDto;
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new Error('Post Has Been Removed');
    }
    const user = await this.usersService.findUserById(sender);
    if (!user) {
      throw new Error('User Not Found');
    }
    const notification = new NotificationEntity();
    notification.recipient = recipient;
    notification.sender = sender;
    notification.action = action;
    notification.postId = postId;
    await this.notificationRepository.save(notification);
    return {
      id: notification.id,
      sender: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar ? { url: user.avatar['url'] } : null,
      },
      seen: notification.seen,
      recipient: notification.recipient,
      action: notification.action,
      postId: notification.postId,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  async seenNotification(id: string) {
    const notification = await this.notificationRepository.findOne(id);
    if (!notification) {
      throw new Error('Notification Not Found');
    }
    notification.seen = 1;
    await this.notificationRepository.save(notification);
    return {
      id: notification.id,
      seen: notification.seen,
    };
  }

  async deleteNotification(id: string) {
    const notification = await this.notificationRepository.findOne(id);
    if (!notification) {
      throw new Error('Notification Not Found');
    }
    await this.notificationRepository.delete(id);
    return {
      id: notification.id,
    };
  }

  async getNotification(currentUserId: string, page: number) {
    const notifications =
      await this.notificationRepository.getNotificationsByUserId(
        currentUserId,
        page,
      );
    return notifications;
  }
}
