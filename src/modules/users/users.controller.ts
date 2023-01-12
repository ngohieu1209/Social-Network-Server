import { SocialLinksEntity } from './../../models/entities/socialLinks.entity';
import { UsersEntity } from './../../models/entities/users.entity';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UpdateSocialLinksDto } from './dto/updateSocialLinks.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getUser(@GetUser() user: UsersEntity): Promise<UsersEntity> {
    return this.usersService.getUser(user.id);
  }

  @Get('social-links')
  getSocialLinks(@GetUser() user: UsersEntity): Promise<SocialLinksEntity> {
    return this.usersService.getSocialLinks(user.id);
  }

  @Patch('update')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: UsersEntity,
  ): Promise<{ msg: string }> {
    return this.usersService.updateUser(user.id, updateUserDto);
  }

  @Patch('update-social-links')
  updateSocialLinks(
    @Body() updateSocialLinksDto: UpdateSocialLinksDto,
    @GetUser() user: UsersEntity,
  ): Promise<{ msg: string }> {
    return this.usersService.updateSocialLinks(user.id, updateSocialLinksDto);
  }

  @Patch('change-password')
  changePassword(
    @Body() changPassword: ChangePasswordDto,
    @GetUser() user: UsersEntity,
  ): Promise<{ msg: string }> {
    const { email } = user;
    const { oldPassword, newPassword } = changPassword;
    return this.usersService.changePassword({
      email,
      oldPassword,
      newPassword,
    });
  }
}
