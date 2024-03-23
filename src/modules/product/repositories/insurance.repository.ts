import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { InsuranceEntity } from '@/modules/product/domains/entities/insurance.entity';

@Injectable()
export class InsuranceRepository extends Repository<InsuranceEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(InsuranceEntity, dataSource.createEntityManager());
  }

  async findByProductId(id: number): Promise<InsuranceEntity> {
    const query = this.createQueryBuilder('insurance').where(
      'product_id = :id',
      { id: id },
    );
    return query.getOne();
  }
}
