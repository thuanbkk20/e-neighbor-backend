import { IsNumber } from 'class-validator';

import { NumberField } from '../../../../decorators';
import { ProductEntity } from '../entities/product.entity';

export class ProductResponseDto {
  entities: ProductEntity[];

  @NumberField()
  @IsNumber()
  itemCount: number;

  constructor(entities: ProductEntity[], itemCount: number) {
    this.entities = entities;
    this.itemCount = itemCount;
  }
}
