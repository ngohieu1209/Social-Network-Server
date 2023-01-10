import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLinksEntity } from './entities';
import { PostRepository } from './repositories/post.repository';
import { UserRepository } from './repositories/users.repository';

const commonRepositories = [UserRepository, SocialLinksEntity, PostRepository];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(commonRepositories)],
  exports: [TypeOrmModule],
})
export class DatabaseCommonModule {}
