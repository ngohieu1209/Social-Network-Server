import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EditCommentDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;
}
