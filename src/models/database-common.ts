import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLinksEntity } from './entities/socialLinks.entity';
import { UserRepository } from './repositories/users.repository';

const commonRepositories = [UserRepository, SocialLinksEntity];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(commonRepositories)],
  exports: [TypeOrmModule],
})
export class DatabaseCommonModule {}
