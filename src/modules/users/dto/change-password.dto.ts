import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  // @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$/, {
  //   message:
  //     'Your password must be at least 8 characters including a lowercase letter, an uppercase letter, a number and a special character',
  // })
  @IsNotEmpty()
  newPassword: string;
}
