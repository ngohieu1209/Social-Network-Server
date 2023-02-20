import { EntityRepository, Repository } from 'typeorm';
import { SocialLinksEntity } from '../entities';

@EntityRepository(SocialLinksEntity)
export class SocialLinksRepository extends Repository<SocialLinksEntity> {
  async getSocialLinksByUser(userId: string): Promise<SocialLinksEntity> {
    const socialLinks = await this.createQueryBuilder('socialLink')
      .where('socialLink.userId = :id', { id: userId })
      .select('socialLink')
      .getOne();
    if (socialLinks) return socialLinks;
    else return null;
  }
}
