import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { UsersEntity } from './../../models/entities/users.entity';
import { UpdateUserDto, ChangePasswordDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getUser(@GetUser() user: UsersEntity): Promise<UsersEntity> {
    return this.usersService.getUser(user.id);
  }

  @Get('profile/:id')
  getUserById(@Param('id') id: string): Promise<UsersEntity> {
    return this.usersService.getUser(id);
  }

  @Patch('update')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: UsersEntity,
  ): Promise<{ msg: string }> {
    return this.usersService.updateUser(user.id, updateUserDto);
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
