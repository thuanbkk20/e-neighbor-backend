import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { StatisticOptionsDto } from '@/modules/lessor/domains/dtos/statisticOptions.dto';
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

  async feedbackStatistic(options: StatisticOptionsDto, lessorId: number) {
    const result = await this.createQueryBuilder('lessor')
      .leftJoinAndSelect('lessor.products', 'product')
      .leftJoinAndSelect('product.orders', 'order')
      .leftJoinAndSelect('order.feedback', 'feedback')
      .where('lessor.id = :lessorId', { lessorId: lessorId })
      .select('SUM(feedback.star)')
      .select('feedback.createdAt')
      .groupBy('feedback.createdAt')
      .getRawMany();
    console.log(result);
  }
}
