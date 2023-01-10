import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryProvider } from './upload.provider';
import { UploadController } from './upload.controller';

@Module({
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
