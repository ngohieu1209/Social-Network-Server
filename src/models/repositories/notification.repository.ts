import { EntityRepository, Repository } from 'typeorm';
import { NotificationEntity } from '../entities';

const perPage = 10;
@EntityRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {
  async getNotificationsByUserId(recipient: string, page: number) {
    const notifications = await this.createQueryBuilder('notification')
      .where('notification.recipient = :recipient', { recipient })
      .andWhere('notification.action NOT IN (:action)', { action: ['message'] })
      .innerJoinAndMapOne(
        'notification.sender',
        'users',
        'user',
        'user.id = notification.sender',
      )
      .leftJoinAndMapOne(
        'user.avatar',
        'upload',
        'avatar',
        'user.avatar = avatar.id',
      )
      .select([
        'notification',
        'user.id',
        'user.firstName',
        'user.lastName',
        'avatar.url',
      ])
      .offset((page - 1) * perPage)
      .limit(perPage)
      .orderBy('notification.createdAt', 'DESC')
      .getManyAndCount();
    if (notifications)
      return {
        data: notifications[0],
        page: page,
        totalPages: Math.ceil(notifications[1] / perPage),
      };
    else return null;
  }
}
