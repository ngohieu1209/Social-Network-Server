import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FriendsRepository,
  PostRepository,
  SocialLinksRepository,
  UploadRepository,
  UserRepository,
  LikeRepository,
  CommentRepository,
  NotificationRepository,
} from './repositories';

const commonRepositories = [
  UserRepository,
  SocialLinksRepository,
  PostRepository,
  FriendsRepository,
  UploadRepository,
  LikeRepository,
  CommentRepository,
  NotificationRepository,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(commonRepositories)],
  exports: [TypeOrmModule],
})
export class DatabaseCommonModule {}
