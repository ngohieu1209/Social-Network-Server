import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  readonly postId: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
