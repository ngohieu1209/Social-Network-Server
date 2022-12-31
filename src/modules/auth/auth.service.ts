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
