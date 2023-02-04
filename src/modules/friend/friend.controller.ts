import { UsersEntity } from './../../models/entities/users.entity';
import { GetUser } from './../../shares/decorators/get-user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestFriendDto } from './dto/request-friend.dto';
import { FriendService } from './friend.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('request')
  requestFriend(
    @Body() requestFriendDto: RequestFriendDto,
    @GetUser() currentUser: UsersEntity,
  ) {
    const { userId } = requestFriendDto;
    return this.friendService.requestFriend(currentUser.id, userId);
  }

  @Post('accept')
  acceptFriend(
    @Body() requestFriendDto: RequestFriendDto,
    @GetUser() currentUser: UsersEntity,
  ) {
    const { userId } = requestFriendDto;
    return this.friendService.acceptFriend(currentUser.id, userId);
  }

  @Get('request/list')
  listRequestFriend(
    @GetUser() currentUser: UsersEntity,
    @Query('page') page: number,
  ) {
    return this.friendService.listRequestFriend(currentUser.id, page);
  }

  @Get('list')
  listFriend(@GetUser() currentUser: UsersEntity, @Query('page') page: number) {
    return this.friendService.listFriend(currentUser.id, page);
  }

  @Get('check')
  checkFriend(
    @GetUser() currentUser: UsersEntity,
    @Query('userId') userId: string,
  ) {
    return this.friendService.checkFriend(currentUser.id, userId);
  }

  @Delete('delete/:userId')
  deleteFriend(
    @GetUser() currentUser: UsersEntity,
    @Param('userId') userId: string,
  ) {
    return this.friendService.deleteFriend(currentUser.id, userId);
  }
}
