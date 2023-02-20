import { PostMode } from '../../../shares/enums/postMode.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsEnum(PostMode)
  postMode: string;

  @IsString()
  @IsOptional()
  content: string;
}
