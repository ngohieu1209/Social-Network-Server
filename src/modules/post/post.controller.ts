import { PostEntity } from './../../models/entities/post.entity';
import { UsersEntity } from './../../models/entities/users.entity';
import { GetUser } from 'src/shares/decorators/get-user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: UsersEntity,
  ): Promise<PostEntity> {
    return this.postService.createPost(user.id, createPostDto);
  }

  @Get('')
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Get('user')
  getPostsByCurrentUser(
    @GetUser() currentUser: UsersEntity,
  ): Promise<PostEntity[]> {
    return this.postService.getPostsByCurrentUser(currentUser.id);
  }

  @Get(':id')
  getPostById(@Param('id') postId: string): Promise<PostEntity> {
    return this.postService.getPostById(postId);
  }

  @Patch(':id')
  updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @Param('id') postId: string,
    @GetUser() user: UsersEntity,
  ): Promise<PostEntity> {
    return this.postService.updatePost(user.id, postId, updatePostDto);
  }

  @Delete(':id')
  deletePost(
    @Param('id') postId: string,
    @GetUser() user: UsersEntity,
  ): Promise<{ msg: string }> {
    return this.postService.deletePost(user.id, postId);
  }

  @Get('user/:id')
  getPostsByUserId(
    @Param('id') userId: string,
    @GetUser() currentUser: UsersEntity,
  ): Promise<PostEntity[]> {
    return this.postService.getPostsByUserId(userId, currentUser.id);
  }
}
