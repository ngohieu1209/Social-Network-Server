import { Module } from '@nestjs/common';
import { PostModule } from '../post/post.module';
import { UsersModule } from '../users/users.module';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UsersModule, PostModule, NotificationModule],
  providers: [CommentService],
  exports: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
