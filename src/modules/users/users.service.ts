import { CreateUserDto } from './dto/createUser.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './../../models/entities/users.entity';
import { UserRepository } from './../../models/repositories/users.repository';
import { httpErrors } from './../../shares/exceptions/index';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UsersEntity> {
    const { email, password } = createUserDto;
    const checkUser = await this.checkUserEmailExisted(email);
    if (checkUser) {
      throw new HttpException(
        httpErrors.ACCOUNT_EXISTED,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = await this.userRepository.save({
      email: email,
      password: password,
    });

    return newUser;
  }

  async findUserById(id: string): Promise<UsersEntity> {
    const user: UsersEntity = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new HttpException(
        httpErrors.ACCOUNT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<UsersEntity> {
    const user: UsersEntity = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException(
        httpErrors.ACCOUNT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async checkUserEmailExisted(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id'],
    });
    return !!user;
  }
}
