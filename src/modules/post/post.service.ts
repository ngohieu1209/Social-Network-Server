import { UpdatePostDto } from './dto/update-post.dto';
import { UsersEntity, PostEntity } from './../../models/entities';
import { UsersService } from './../users/users.service';
import { httpErrors } from './../../shares/exceptions/index';
import { PostRepository, FriendsRepository } from './../../models/repositories';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,

    @InjectRepository(FriendsRepository)
    private readonly friendsRepository: FriendsRepository,

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
      userId: user.id,
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

  async getPostsByCurrentUser(currentUserId: string): Promise<PostEntity[]> {
    const posts = await this.postRepository.find({
      relations: ['userId'],
      where: { userId: currentUserId },
    });
    return posts;
  }

  async getPostsByUserId(userId: string, currentUserId: string) {
    if (userId === currentUserId) {
      return await this.getPostsByCurrentUser(currentUserId);
    }
    const isFriend = await this.friendsRepository.getStatusFriend(
      currentUserId,
      userId,
    );
    const posts = await this.postRepository.find({
      relations: ['userId'],
      where: [
        { userId: userId, postMode: 'public' },
        {
          userId: userId,
          postMode: isFriend === 'friend' ? 'friend' : 'public',
        },
      ],
    });
    return posts;
  }
}
