import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  avatar: string;

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
