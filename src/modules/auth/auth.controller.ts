import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersEntity } from './../../models/entities/users.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto, ActivateEmailDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(200)
  signUp(@Body() createUserDto: CreateUserDto): Promise<{ msg: string }> {
    return this.authService.signUp(createUserDto);
  }

  @Post('activation')
  @HttpCode(200)
  activateEmail(
    @Body() activateEmailDto: ActivateEmailDto,
  ): Promise<{ msg: string }> {
    return this.authService.activateEmail(activateEmailDto);
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ): Promise<{ msg: string }> {
    const { refreshToken } = await this.authService.signIn(signInDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      path: '/api/v1/auth/refreshToken',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { msg: 'Login Success!' };
  }

  @Post('/refreshToken')
  @HttpCode(200)
  async getAccessToken(@Req() req: Request): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies['refreshToken'];
    return this.authService.getAccessToken(refreshToken);
  }

  @Post('/forgot')
  @HttpCode(200)
  forgotPassword(@Body('email') email: string): Promise<{ msg: string }> {
    return this.authService.forgotPassword(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/resetPassword')
  @HttpCode(200)
  resetPassword(
    @Body('password') password: string,
    @GetUser() user: UsersEntity,
  ): Promise<{ msg: string }> {
    const { id } = user;
    return this.authService.resetPassword({ id, password });
  }

  @Post('/logout')
  @HttpCode(200)
  logout(@Res() res: Response) {
    res.clearCookie('refreshToken', {
      path: '/api/v1/auth/refreshToken',
    });
    return { msg: 'Logout success!' };
  }
}
