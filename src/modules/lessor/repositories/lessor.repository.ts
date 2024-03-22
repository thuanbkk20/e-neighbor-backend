import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';

@Injectable()
export class LessorRepository extends Repository<LessorEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(LessorEntity, dataSource.createEntityManager());
  }

  async findOneById(id: number): Promise<LessorEntity | null> {
    const queryBuilder = this.createQueryBuilder('lessor')
      .leftJoinAndSelect('lessor.user', 'user')
      .where('lessor.id = :id', { id });
    return queryBuilder.getOne();
  }

  async findOneByUserId(id: number): Promise<LessorEntity | null> {
    const queryBuilder = this.createQueryBuilder('lessor')
      .leftJoinAndSelect('lessor.user', 'user')
      .where('lessor.user_id = :id', { id });
    return queryBuilder.getOne();
  }
}
