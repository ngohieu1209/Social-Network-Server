import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ActivateEmailDto } from './dto/activateEmail.dto';
import { httpErrors } from './../../shares/exceptions/index';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from './dto/accessToken.dto';
import { ActivationTokenDto } from './dto/ActivationToken.dto';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ msg: string }> {
    const { email, password } = createUserDto;

    const user = await this.usersService.checkUserEmailExisted(email);
    if (user)
      throw new HttpException(
        httpErrors.ACCOUNT_EXISTED,
        HttpStatus.BAD_REQUEST,
      );

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser: ActivationTokenDto = { email, password: passwordHash };
    const activationToken = this.createActivationToken(newUser);
    console.log(activationToken);
    return { msg: 'Register Success! Please activate your email to start.' };
  }

  async activateEmail(
    activateEmailDto: ActivateEmailDto,
  ): Promise<{ msg: string }> {
    const { activationToken } = activateEmailDto;
    try {
      const userActivation: ActivationTokenDto =
        await this.jwtService.verifyAsync(activationToken, {
          secret: this.configService.get('ACTIVATION_TOKEN_SECRET'),
        });
      const { email, password } = userActivation;

      const checkEmail = await this.usersService.checkUserEmailExisted(email);
      if (checkEmail)
        throw new HttpException(
          httpErrors.ACCOUNT_EXISTED,
          HttpStatus.BAD_REQUEST,
        );

      const newUser = { email, password };
      await this.usersService.createUser(newUser);
      return { msg: 'Account has been activated!' };
    } catch (error) {
      throw new HttpException(
        httpErrors.ACTIVATION_TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ refreshToken: string }> {
    const { email, password } = signInDto;
    const user = await this.usersService.findUserByEmail(email);
    if (!user)
      throw new HttpException(
        httpErrors.ACCOUNT_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new HttpException(
        httpErrors.ACCOUNT_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );

    const refreshToken = this.createRefreshToken({ id: user.id });
    return { refreshToken };
  }

  async getAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const userRefresh: RefreshTokenDto = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        },
      );
      const { id } = userRefresh;
      const accessToken = this.createAccessToken({ id });
      return { accessToken };
    } catch (error) {
      throw new HttpException(
        httpErrors.REFRESH_TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgotPassword(email: string): Promise<{ msg: string }> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user)
      throw new HttpException(
        httpErrors.USER_EMAIL_NOT_EXISTED,
        HttpStatus.BAD_REQUEST,
      );
    const accessToken = this.createAccessToken({ id: user.id });
    // send Mail

    return { msg: 'Please check your email to reset password!' };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ msg: string }> {
    const { id, password } = resetPasswordDto;
    const passwordHash = await bcrypt.hash(password, 12);
    try {
      await this.usersService.findOneByIdAndUpdatePassword(id, passwordHash);
      return { msg: 'Password successfully changed!' };
    } catch (error) {
      throw new HttpException(
        httpErrors.CHANGE_PASSWORD_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  createActivationToken = (payload: ActivationTokenDto) => {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('ACTIVATION_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACTIVATION_TOKEN_EXPIRATION_TIME'),
    });
  };

  createAccessToken = (payload: AccessTokenDto) => {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });
  };

  createRefreshToken = (payload: RefreshTokenDto) => {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });
  };
}
