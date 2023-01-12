import { UsersEntity } from './../../models/entities/users.entity';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { ActivateEmailDto } from './dto/activateEmail.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ): Promise<void> {
    const { refreshToken } = await this.authService.signIn(signInDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      path: '/api/v1/auth/refreshToken',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ msg: 'Login Success!' });
  }

  @Post('/refreshToken')
  async getAccessToken(@Req() req: Request): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies['refreshToken'];
    return this.authService.getAccessToken(refreshToken);
  }

  @Post('/forgot')
  forgotPassword(@Body('email') email: string): Promise<{ msg: string }> {
    return this.authService.forgotPassword(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/resetPassword')
  resetPassword(
    @Body('password') password: string,
    @GetUser() user: UsersEntity,
  ): Promise<{ msg: string }> {
    const { id } = user;
    return this.authService.resetPassword({ id, password });
  }

  @Post('/logout')
  logout(@Res() res: Response) {
    res.clearCookie('refreshToken', {
      path: '/api/v1/auth/refreshToken',
    });
    return res.json({ msg: 'Logout success!' });
  }
}
