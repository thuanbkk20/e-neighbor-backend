import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SurChargeEntity } from '../domains/entities/surcharge.entity';

@Injectable()
export class SurchargeRepository extends Repository<SurChargeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(SurChargeEntity, dataSource.createEntityManager());
  }
}
