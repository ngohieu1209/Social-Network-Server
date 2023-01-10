import { UserRepository } from './../../models/repositories/users.repository';
import { UpdatePostDto } from './dto/updatePost.dto';
import { UsersEntity } from './../../models/entities/users.entity';
import { UsersService } from './../users/users.service';
import { PostEntity } from './../../models/entities/post.entity';
import { httpErrors } from './../../shares/exceptions/index';
import { PostRepository } from './../../models/repositories/post.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly uploadService: UploadService,
    private readonly usersService: UsersService,
  ) {}

  async createPost(
    id: string,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const user: UsersEntity = await this.usersService.findUserById(id);
    if (!user) {
      throw new HttpException(
        httpErrors.ACCOUNT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPost = await this.postRepository.save({
      ...createPostDto,
      userId: user,
    });
    return newPost;
  }

  async getAllPost() {
    return await this.postRepository.find({
      relations: ['userId'],
    });
  }

  async getPostById(postId: string) {
    const post: PostEntity = await this.postRepository.findOne({
      relations: ['userId'],
      where: { id: postId },
    });
    if (!post) {
      throw new HttpException(
        httpErrors.POST_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    return post;
  }

  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    const post: PostEntity = await this.postRepository.findOne({
      relations: ['userId'],
      where: { userId: userId, id: postId },
    });
    if (!post) {
      throw new HttpException(
        httpErrors.POST_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPost: PostEntity = await this.postRepository.save({
      ...post,
      ...updatePostDto,
    });
    return newPost;
  }

  async deletePost(userId: string, postId: string): Promise<{ msg: string }> {
    const post: PostEntity = await this.postRepository.findOne({
      relations: ['userId'],
      where: { userId: userId, id: postId },
    });
    if (!post) {
      throw new HttpException(
        httpErrors.POST_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.postRepository.delete(post.id);
    return { msg: 'Delete post successfully' };
  }
}
