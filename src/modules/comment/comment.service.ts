import { NotificationService } from './../notification/notification.service';
import { EditCommentDto } from './dto/edit-comment.dto';
import { CommentRepository, PostRepository } from './../../models/repositories';
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,

    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,

    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const { postId, userId, content } = createCommentDto;
    let notification = null;
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new Error('Post Has Been Removed');
    }
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new Error('User Not Found');
    }
    if (content === undefined || (content === '' && content.length < 1)) {
      throw new Error('Comment text is required');
    }

    const newComment = await this.commentRepository.save({
      content,
      postId,
      userId,
    });
    post.commentsCount++;
    await this.postRepository.save(post);
    if (post.userId !== userId) {
      notification = await this.notificationService.createNotification({
        recipient: post.userId,
        sender: userId,
        action: 'commented',
        postId,
      });
    }
    return {
      comment: {
        id: newComment.id,
        userId: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar ? user.avatar['url'] : null,
        },
        postId: newComment.postId,
        content: newComment.content,
        createdAt: newComment.createdAt,
        updatedAt: newComment.updatedAt,
      },
      notification,
    };
  }

  async getCommentsByPostId(postId: string, page: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new Error('Post Has Been Removed');
    }
    const comments = await this.commentRepository.getCommentsByPostId(
      postId,
      page,
    );
    return comments;
  }

  async editComment(editCommentDto: EditCommentDto) {
    const comment = await this.commentRepository.update(
      { id: editCommentDto.id },
      { content: editCommentDto.content },
    );
    if (!comment.affected) {
      throw new Error('Comment Not Found');
    }
    return editCommentDto;
  }

  async deleteComment(deleteCommentDto: DeleteCommentDto) {
    const comment = await this.commentRepository.delete({
      id: deleteCommentDto.id,
    });
    await this.postRepository.update(
      {
        id: deleteCommentDto.postId,
      },
      { commentsCount: () => 'commentsCount - 1' },
    );
    if (!comment.affected) {
      throw new Error('Comment Not Found');
    }
    return deleteCommentDto;
  }
}
