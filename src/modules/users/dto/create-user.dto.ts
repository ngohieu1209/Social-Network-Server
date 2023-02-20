import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  // @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$/, {
  //   message:
  //     'Your password must be at least 8 characters including a lowercase letter, an uppercase letter, a number and a special character',
  // })
  @IsNotEmpty()
  password: string;
}
