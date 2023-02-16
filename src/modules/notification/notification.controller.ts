import { GetUser } from './../../shares/decorators/get-user.decorator';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { UsersEntity } from 'src/models/entities';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getNotifications(@GetUser() user: UsersEntity, @Query('page') page: number) {
    return this.notificationService.getNotification(user.id, page);
  }
}
