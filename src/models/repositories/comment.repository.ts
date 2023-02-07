import { EntityRepository, Repository } from 'typeorm';
import { CommentEntity } from '../entities';

const perPage = 10;

@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {
  async getCommentsByPostId(postId: string, page: number) {
    const comments = await this.createQueryBuilder('comment')
      .where('comment.postId = :postId', { postId })
      .innerJoinAndMapOne(
        'comment.userId',
        'users',
        'user',
        'user.id = comment.userId',
      )
      .leftJoinAndMapOne(
        'user.avatar',
        'upload',
        'avatar',
        'user.avatar = avatar.id',
      )
      .innerJoinAndMapOne(
        'comment.postId',
        'post',
        'post',
        'post.id = comment.postId',
      )
      .select([
        'comment',
        'user.id',
        'user.firstName',
        'user.lastName',
        'avatar.url',
        'post.id',
        'post.userId',
      ])
      .offset((page - 1) * perPage)
      .limit(perPage)
      .orderBy('comment.createdAt', 'DESC')
      .getManyAndCount();
    if (comments)
      return {
        data: comments[0],
        page: page,
        totalPages: Math.ceil(comments[1] / perPage),
      };
    else return null;
  }
}
