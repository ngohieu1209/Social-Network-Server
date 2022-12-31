import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { ActivateEmailDto } from './dto/activateEmail.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<{ msg: string }> {
    return this.authService.signUp(createUserDto);
  }

  @Post('activation')
  activateEmail(
    @Body() activateEmailDto: ActivateEmailDto,
  ): Promise<{ msg: string }> {
    return this.authService.activateEmail(activateEmailDto);
  }
}
