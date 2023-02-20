import { EntityRepository, Repository } from 'typeorm';
import { UploadEntity } from '../entities';

@EntityRepository(UploadEntity)
export class UploadRepository extends Repository<UploadEntity> {}
