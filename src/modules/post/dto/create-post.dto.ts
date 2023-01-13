import { PostMode } from '../../../shares/enums/postMode.enum';
import { IsEnum, IsOptional, IsString, Min } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsEnum(PostMode)
  postMode: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @Min(2)
  @IsOptional()
  hashtag: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  video: string;
}
