import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductSurChargeEntity } from '@/modules/product/domains/entities/product-surcharge.entity';

@Injectable()
export class ProductSurchargeRepository extends Repository<ProductSurChargeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ProductSurChargeEntity, dataSource.createEntityManager());
  }
}
