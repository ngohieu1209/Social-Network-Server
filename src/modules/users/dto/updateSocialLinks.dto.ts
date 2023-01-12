import { IsOptional, IsString } from 'class-validator';

export class UpdateSocialLinksDto {
  @IsString()
  @IsOptional()
  linkFacebook: string;

  @IsString()
  @IsOptional()
  linkInstagram: string;

  @IsString()
  @IsOptional()
  linkGithub: string;
}
