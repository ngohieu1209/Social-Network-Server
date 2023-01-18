import { EntityRepository, Repository } from 'typeorm';
import { PostEntity } from '../entities';

const perPage = 10;
@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async getByCurrentUser(currentUserId: string, page: number) {
    const posts = await this.createQueryBuilder('post')
      .where('post.userId = :currentUserId', { currentUserId })
      .innerJoinAndMapOne(
        'post.userId',
        'users',
        'user',
        'user.id = post.userId',
      )
      .leftJoinAndMapMany(
        'post.upload',
        'upload',
        'upload',
        'post.id = upload.postId',
      )
      .select([
        'post',
        'user.id',
        'user.avatar',
        'user.firstName',
        'user.lastName',
        'upload',
      ])
      .offset((page - 1) * perPage)
      .limit(perPage)
      .orderBy('post.createdAt', 'DESC')
      .getManyAndCount();
    if (posts)
      return {
        data: posts[0],
        page: page,
        totalPages: Math.ceil(posts[1] / perPage),
      };
    else return null;
  }

  async getByUserId(userId: string, friendStatus: string, page: number) {
    const posts = await this.createQueryBuilder('post')
      .where('post.userId = :userId', { userId })
      .innerJoinAndMapOne(
        'post.userId',
        'users',
        'user',
        'user.id = post.userId',
      )
      .leftJoinAndMapMany(
        'post.upload',
        'upload',
        'upload',
        'post.id = upload.postId',
      )
      .select([
        'post',
        'user.id',
        'user.avatar',
        'user.firstName',
        'user.lastName',
        'upload',
      ])
      .where('post.userId = :userId', { userId })
      .andWhere('post.postMode IN (:postMode)', {
        postMode: ['public', `${friendStatus === 'friend' && 'friend'}`],
      })
      .offset((page - 1) * perPage)
      .limit(perPage)
      .orderBy('post.createdAt', 'DESC')
      .getManyAndCount();
    if (posts)
      return {
        data: posts[0],
        page: page,
        totalPages: Math.ceil(posts[1] / perPage),
      };
    else return null;
  }

  async getAll(listFriends: string[], listFollowing: string[], page: number) {
    const listUser = [...listFollowing, ...listFriends];
    const posts = await this.createQueryBuilder('post')
      .innerJoinAndMapOne(
        'post.userId',
        'users',
        'user',
        'user.id = post.userId',
      )
      .leftJoinAndMapMany(
        'post.upload',
        'upload',
        'upload',
        'post.id = upload.postId',
      )
      .select([
        'post',
        'user.id',
        'user.avatar',
        'user.firstName',
        'user.lastName',
        'upload',
      ])
      .where(
        '(post.postMode = "public" AND post.userId IN (:listUser)) OR (post.postMode = "friend" AND post.userId IN (:listFriends))',
        {
          listUser: listUser.length > 0 ? listUser : [''],
          listFriends: listFriends.length ? listFriends : [''],
        },
      )
      .offset((page - 1) * perPage)
      .limit(perPage)
      .orderBy('post.createdAt', 'DESC')
      .getManyAndCount();
    if (posts)
      return {
        data: posts[0],
        page: page,
        totalPages: Math.ceil(posts[1] / perPage),
      };
    else return null;
  }

  async getById(id: string) {
    const post = await this.createQueryBuilder('post')
      .innerJoinAndMapOne(
        'post.userId',
        'users',
        'user',
        'user.id = post.userId',
      )
      .leftJoinAndMapMany(
        'post.upload',
        'upload',
        'upload',
        'post.id = upload.postId',
      )
      .select([
        'post',
        'user.id',
        'user.avatar',
        'user.firstName',
        'user.lastName',
        'upload',
      ])
      .where('(post.id = :id)', {
        id,
      })
      .getOne();
    if (post) return post;
    else return null;
  }
}
