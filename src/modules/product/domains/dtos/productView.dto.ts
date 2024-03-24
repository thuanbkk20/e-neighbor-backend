import { ApiProperty } from '@nestjs/swagger';

import { STATUS, StatusType } from '@/constants/status';
import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';
import { CategoryEntity } from '@/modules/category/domains/entities/category.entity';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';

export class ProductViewDto {
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
  accessCount: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  category: CategoryEntity;

  @ApiProperty()
  lessorImage: string;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.timeUnit = product.timeUnit;
    this.value = product.value;
    this.status = product.status;
    this.rating = product.rating;
    this.accessCount = product.accessCount;
    this.category = product.category;
    this.lessorImage = product.lessor.user.avatar;
  }
}
