import { EntityRepository, Repository } from 'typeorm';
import { LikeEntity } from '../entities';

@EntityRepository(LikeEntity)
export class LikeRepository extends Repository<LikeEntity> {}
