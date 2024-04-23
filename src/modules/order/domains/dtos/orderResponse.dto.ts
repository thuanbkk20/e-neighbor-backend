import { IsNumber } from 'class-validator';

import { NumberField } from '@/decorators';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';

export class OrderResponseDto {
  entities: OrderEntity[];

  @NumberField()
  @IsNumber()
  itemCount: number;

  constructor(entities: OrderEntity[], itemCount: number) {
    this.entities = entities;
    this.itemCount = itemCount;
  }
}
