import { EntityRepository, Repository } from 'typeorm';
import { PostEntity } from '../entities';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {}
