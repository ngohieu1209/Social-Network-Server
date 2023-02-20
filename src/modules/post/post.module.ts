import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { UsersModule } from '../users/users.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [UploadModule, UsersModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
