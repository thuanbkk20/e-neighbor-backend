import { Injectable } from '@nestjs/common';
import { SurchargeEntity } from '@/modules/surcharge/domains/entities/surcharge.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SurchargeRepository extends Repository<SurchargeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(SurchargeEntity, dataSource.createEntityManager());
  }

  async getByProductSurchargeId(id: number): Promise<SurchargeEntity> {
    const queryBuilder = this.createQueryBuilder('surcharges')
      .leftJoinAndSelect('surcharges.productSurcharges', 'productSurcharges')
      .where('productSurcharges.id = :id', { id: id });
    return queryBuilder.getOne();
  }
}
