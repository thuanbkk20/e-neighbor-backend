import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../domains/entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  async findOneById(id: number): Promise<ProductEntity> {
    const query = this.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.lessor', 'lessor')
      .leftJoinAndSelect('products.productSurcharges', 'productSurcharges')
      .leftJoinAndSelect('productSurcharges.surcharge', 'surcharge')
      .where('products.id = :id', { id: id });
    return query.getOne();
  }
}
