import { ResponsePostsDto } from './../../shares/dtos/response-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  UsersEntity,
  PostEntity,
  FriendsEntity,
} from './../../models/entities';
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

  async getAllPost(userId: string, page: number) {
    const friends: FriendsEntity[] =
      await this.friendsRepository.getListFriends(userId);
    const friendUserSend = friends
      .filter((friend: FriendsEntity) => friend.user_send_request !== userId)
      .map((friend: FriendsEntity) => friend.user_send_request);
    const friendUserReceive = friends
      .filter((friend: FriendsEntity) => friend.user_receive_request !== userId)
      .map((friend: FriendsEntity) => friend.user_receive_request);
    const listFriends = [...friendUserSend, ...friendUserReceive, userId];

    const followings = await this.friendsRepository.getListFollowing(userId);
    const listFollowing = followings.map(
      (following: FriendsEntity) => following.user_receive_request,
    );

    return await this.postRepository.getAll(listFriends, listFollowing, page);
  }

  async getPostById(postId: string) {
    const post: PostEntity = await this.postRepository.getById(postId);
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

  async getPostsByCurrentUser(
    currentUserId: string,
    page: number,
  ): Promise<ResponsePostsDto<PostEntity[]>> {
    const data = await this.postRepository.getByCurrentUser(
      currentUserId,
      page,
    );
    return data;
  }

  async getPostsByUserId(
    userId: string,
    currentUserId: string,
    page: number,
  ): Promise<ResponsePostsDto<PostEntity[]>> {
    try {
      if (userId === currentUserId) {
        return await this.getPostsByCurrentUser(currentUserId, page);
      }
      const friendStatus = await this.friendsRepository.getStatusFriend(
        currentUserId,
        userId,
      );
      const posts = await this.postRepository.getByUserId(
        userId,
        friendStatus,
        page,
      );
      return posts;
    } catch (error) {}
  }
}
