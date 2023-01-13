import { Module } from '@nestjs/common';
import { SocialLinkService } from './social-link.service';
import { SocialLinkController } from './social-link.controller';

@Module({
  providers: [SocialLinkService],
  controllers: [SocialLinkController],
})
export class SocialLinkModule {}
