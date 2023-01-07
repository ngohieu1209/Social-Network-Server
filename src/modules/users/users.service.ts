import { SocialLinksEntity } from './../../models/entities/socialLinks.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './../../models/entities/users.entity';
import { UserRepository } from './../../models/repositories/users.repository';
import { httpErrors } from './../../shares/exceptions/index';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(SocialLinksEntity)
    private readonly socialLinksRepository: Repository<SocialLinksEntity>,
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

  async getSocialLinks(userId: string): Promise<SocialLinksEntity> {
    const socialLink = await this.socialLinksRepository
      .createQueryBuilder('socialLink')
      .where('socialLink.userId = :id', { id: userId })
      .innerJoinAndSelect('socialLink.userId', 'user')
      .select(['socialLink', 'user.id'])
      .getOne();
    return socialLink;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ msg: string }> {
    const {
      firstName,
      lastName,
      avatar,
      linkFacebook,
      linkInstagram,
      linkGithub,
    } = updateUserDto;

    const socialLink = await this.getSocialLinks(id);

    const user = await this.findUserById(id);

    if (!socialLink) {
      const newSocialLink = new SocialLinksEntity();
      newSocialLink.linkFacebook = linkFacebook;
      newSocialLink.linkInstagram = linkInstagram;
      newSocialLink.linkGithub = linkGithub;
      newSocialLink.userId = user;
      await this.socialLinksRepository.save(newSocialLink);
    } else {
      socialLink.linkFacebook = linkFacebook;
      socialLink.linkInstagram = linkInstagram;
      socialLink.linkGithub = linkGithub;
      await this.socialLinksRepository.save(socialLink);
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.avatar = avatar;
    await this.userRepository.save(user);

    return { msg: 'Update Success !' };
  }

  async changePassword<T extends ChangePasswordDto & { email: string }>({
    email,
    oldPassword,
    newPassword,
  }: T): Promise<{ msg: string }> {
    const user = await this.findUserByEmail(email);

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
    const user: UsersEntity = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    return user;
  }

  async findUserByEmail(email: string): Promise<UsersEntity> {
    const user: UsersEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .addSelect('user.password')
      .getOne();
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
}
