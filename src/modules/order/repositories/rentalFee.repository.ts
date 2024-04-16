import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RentalFeeEntity } from '@/modules/order/domains/entities/rental-fee.entity';

@Injectable()
export class RentalFeeRepository extends Repository<RentalFeeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RentalFeeEntity, dataSource.createEntityManager());
  }
}
