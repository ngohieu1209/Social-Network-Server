import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from './../../models/entities';
import { UserRepository } from './../../models/repositories';
import { httpErrors } from './../../shares/exceptions/index';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto';

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

    return await this.userRepository.save({
      email: email,
      password: password,
    });
  }

  async getUser(id: string): Promise<UsersEntity> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new HttpException(
        httpErrors.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ msg: string }> {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new HttpException(
        httpErrors.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.avatar = updateUserDto.avatar;
    user.location = updateUserDto.location;
    user.bio = updateUserDto.bio;

    await this.userRepository.save(user);

    return { msg: 'Update Success !' };
  }

  async changePassword<T extends ChangePasswordDto & { email: string }>({
    email,
    oldPassword,
    newPassword,
  }: T): Promise<{ msg: string }> {
    const user = await this.userRepository.findUserByEmail(email);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch)
      throw new HttpException(
        httpErrors.OLD_PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );

    const passwordHash = await bcrypt.hash(newPassword, 12);
    user.password = passwordHash;
    await this.userRepository.save(user);
    return { msg: 'Change Password Success !' };
  }

  async findUserById(id: string): Promise<UsersEntity> {
    const user: UsersEntity = await this.userRepository.findUserById(id);
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

  async findOneByIdAndUpdatePassword(
    id: string,
    password: string,
  ): Promise<boolean> {
    const result = await this.userRepository.update(
      { id: id },
      { password: password },
    );
    return result.affected === 1;
  }

  async findUsersByName(currentUserId: string, name: string) {
    const users = await this.userRepository.findUsersByName(
      currentUserId,
      name,
    );
    return users;
  }
}
