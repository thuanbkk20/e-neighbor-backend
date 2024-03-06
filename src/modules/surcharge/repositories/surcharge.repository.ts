import { Injectable } from '@nestjs/common';
import { SurchargeEntity } from '../domains/entities/surcharge.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SurchargeRepository extends Repository<SurchargeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(SurchargeEntity, dataSource.createEntityManager());
  }
}
