import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as config from './ormconfig';
import { DatabaseCommonModule } from './models/database-common';
import { PostModule } from './modules/post/post.module';
import { UploadModule } from './modules/upload/upload.module';
import { SocialLinkModule } from './modules/social-link/social-link.module';
import { FriendModule } from './modules/friend/friend.module';
import { LikeModule } from './modules/like/like.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      ...config,
      entities: [__dirname + '/../models/entities/**/*{.ts, .js}'],
      autoLoadEntities: true,
    }),
    DatabaseCommonModule,
    AuthModule,
    UsersModule,
    PostModule,
    UploadModule,
    SocialLinkModule,
    FriendModule,
    LikeModule,
  ],
})
export class AppModule {}
