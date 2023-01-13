import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialLinksEntity } from 'src/models/entities';
import { SocialLinksRepository } from 'src/models/repositories';
import { CreateSocialLinksDto } from './dto/create-social-links.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';

@Injectable()
export class SocialLinkService {
  constructor(
    @InjectRepository(SocialLinksRepository)
    private readonly socialLinksRepository: SocialLinksRepository,
  ) {}

  async createSocialLinks(
    userId: string,
    createSocialLinks: CreateSocialLinksDto,
  ) {
    const socialLink = new SocialLinksEntity();
    socialLink.linkFacebook = createSocialLinks.linkFacebook;
    socialLink.linkInstagram = createSocialLinks.linkInstagram;
    socialLink.linkGithub = createSocialLinks.linkGithub;
    socialLink.userId = userId;
    await this.socialLinksRepository.save(socialLink);
  }

  async getSocialLinks(userId: string): Promise<SocialLinksEntity> {
    const socialLink = await this.socialLinksRepository.getSocialLinksByUser(
      userId,
    );
    return socialLink;
  }

  async updateSocialLinks(
    userId: string,
    updateSocialLinksDto: UpdateSocialLinksDto,
  ): Promise<{ msg: string }> {
    const socialLink = await this.getSocialLinks(userId);
    if (!socialLink) {
      this.createSocialLinks(userId, updateSocialLinksDto);
    } else {
      socialLink.linkFacebook = updateSocialLinksDto.linkFacebook;
      socialLink.linkInstagram = updateSocialLinksDto.linkInstagram;
      socialLink.linkGithub = updateSocialLinksDto.linkGithub;
      await this.socialLinksRepository.save(socialLink);
    }
    return { msg: 'Update Success !' };
  }
}
