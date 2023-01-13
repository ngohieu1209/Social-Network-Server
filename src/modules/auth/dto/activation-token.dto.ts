import { IsEmail, IsString } from 'class-validator';

export class ActivationTokenDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
