import { UsersEntity } from './../../models/entities/users.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikeService } from './like.service';
import { LikePostDto } from './dto/like-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  @Post()
  @HttpCode(200)
  likePost(
    @GetUser() user: UsersEntity,
    @Body() likePostDto: LikePostDto,
  ): Promise<{ msg: string }> {
    const { postId } = likePostDto;
    return this.likeService.likePost(user.id, postId);
  }

  @Get('/post/:postId')
  getUserLikePost(@Param('postId') postId: string) {
    return this.likeService.getUserLikePost(postId);
  }
}
