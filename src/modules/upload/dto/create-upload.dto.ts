import { IsOptional, IsString } from 'class-validator';

export class CreateUploadDto {
  @IsString()
  @IsOptional()
  public_id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  file: string;

  @IsString()
  @IsOptional()
  fileType: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  postId: string;
}
