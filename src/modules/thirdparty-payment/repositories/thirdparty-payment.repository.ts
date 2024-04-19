import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ThirdpartyPaymentEntity } from '@/modules/thirdparty-payment/domains/entities/payment.entity';

@Injectable()
export class ThirdpartyPaymentRepository extends Repository<ThirdpartyPaymentEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ThirdpartyPaymentEntity, dataSource.createEntityManager());
  }
}
