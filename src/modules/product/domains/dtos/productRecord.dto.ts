import { ApiProperty } from '@nestjs/swagger';

import { STATUS, StatusType } from './../../../../constants/status';

import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';
import { CategoryEntity } from '@/modules/category/domains/entities/category.entity';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';

export class ProductRecordDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ type: 'enum', enum: TIME_UNIT })
  timeUnit: TimeUnitType;

  @ApiProperty()
  value: number;

  @ApiProperty({ type: 'enum', enum: STATUS })
  status: StatusType;

  @ApiProperty()
  turnOver: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  category: CategoryEntity;

  @ApiProperty()
  lessorId: number;

  constructor(product: ProductEntity, turnOver: number, rating: number) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.timeUnit = product.timeUnit;
    this.value = product.value;
    this.status = product.status;
    this.turnOver = turnOver;
    this.rating = rating;
    this.category = product.category;
  }
}
