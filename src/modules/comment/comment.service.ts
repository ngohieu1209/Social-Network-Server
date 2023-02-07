import { CommentEntity } from './../../models/entities/comment.entity';
import { CommentRepository, PostRepository } from './../../models/repositories';
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from '../post/post.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,

    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,

    private readonly usersService: UsersService,
    private readonly postService: PostService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const { postId, userId, content } = createCommentDto;
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (content === undefined || (content === '' && content.length < 1)) {
      throw new Error('Comment text is required');
    }

    const comment = new CommentEntity();
    comment.content = content;
    comment.postId = postId;
    comment.userId = userId;
    await this.commentRepository.save(comment);
    post.commentsCount++;
    await this.postRepository.save(post);
    return {
      commentId: comment.id,
      author: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar['url'] || null,
      },
      post: {
        id: post.id,
        userId: post.userId,
      },
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  async getCommentsByPostId(postId: string, page: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new Error('Post not found');
    }
    const comments = await this.commentRepository.getCommentsByPostId(
      postId,
      page,
    );
    return comments;
  }
}
