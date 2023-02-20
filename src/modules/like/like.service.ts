import { LikeRepository, PostRepository } from './../../models/repositories';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { httpErrors } from 'src/shares/exceptions';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeRepository)
    private readonly likeRepository: LikeRepository,

    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
  ) {}
  async likePost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({ id: postId });
    if (!post)
      throw new HttpException(
        httpErrors.POST_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    const like = await this.likeRepository.findOne({ userId, postId });
    if (like) {
      await this.likeRepository.delete({ userId, postId });
      await this.postRepository.update(
        { id: postId },
        { likesCount: () => 'likesCount - 1' },
      );
      return { msg: 'Unlike post successfully' };
    } else {
      await this.likeRepository.save({ userId, postId });
      await this.postRepository.update(
        { id: postId },
        { likesCount: () => 'likesCount + 1' },
      );
      return { msg: 'Like post successfully' };
    }
  }

  async getUserLikePost(postId: string) {
    const like = await this.likeRepository.find({
      where: { postId },
      select: ['userId'],
    });
    const listUserId = like.map((item) => item.userId);
    return listUserId;
  }
}
