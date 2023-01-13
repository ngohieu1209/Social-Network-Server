import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FriendsRepository,
  PostRepository,
  SocialLinksRepository,
  UploadRepository,
  UserRepository,
} from './repositories';

const commonRepositories = [
  UserRepository,
  SocialLinksRepository,
  PostRepository,
  FriendsRepository,
  UploadRepository,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(commonRepositories)],
  exports: [TypeOrmModule],
})
export class DatabaseCommonModule {}
