import { IsOptional, IsString } from 'class-validator';

export class CreateSocialLinksDto {
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
