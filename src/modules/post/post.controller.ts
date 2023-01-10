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
import { CreatePostDto } from './dto/createPost.dto';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePostDto } from './dto/updatePost.dto';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: UsersEntity,
  ): Promise<PostEntity> {
    return await this.postService.createPost(user.id, createPostDto);
  }

  @Get('')
  async getAllPost() {
    return await this.postService.getAllPost();
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string): Promise<PostEntity> {
    return await this.postService.getPostById(postId);
  }

  @Patch(':id')
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @Param('id') postId: string,
    @GetUser() user: UsersEntity,
  ): Promise<PostEntity> {
    return await this.postService.updatePost(user.id, postId, updatePostDto);
  }

  @Delete(':id')
  async deletePost(
    @Param('id') postId: string,
    @GetUser() user: UsersEntity,
  ): Promise<{ msg: string }> {
    return await this.postService.deletePost(user.id, postId);
  }
}
