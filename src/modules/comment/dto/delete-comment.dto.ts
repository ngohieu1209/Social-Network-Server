import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCommentDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  postId: string;
}
