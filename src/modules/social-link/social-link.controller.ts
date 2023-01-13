import { SocialLinksEntity, UsersEntity } from './../../models/entities';
import { GetUser } from './../../shares/decorators/get-user.decorator';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SocialLinkService } from './social-link.service';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('social-link')
export class SocialLinkController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @Get()
  getSocialLinks(@GetUser() user: UsersEntity): Promise<SocialLinksEntity> {
    return this.socialLinkService.getSocialLinks(user.id);
  }

  @Patch()
  updateSocialLinks(
    @Body() updateSocialLinksDto: UpdateSocialLinksDto,
    @GetUser() user: UsersEntity,
  ): Promise<{ msg: string }> {
    return this.socialLinkService.updateSocialLinks(
      user.id,
      updateSocialLinksDto,
    );
  }
}
