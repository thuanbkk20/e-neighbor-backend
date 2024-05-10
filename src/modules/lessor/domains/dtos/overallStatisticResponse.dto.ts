import { ApiProperty } from '@nestjs/swagger';

import { ORDER_STATUS, OrderStatusType } from '@/constants/order-status';

class OrderByStatusDto {
  @ApiProperty({
    type: 'enum',
    enum: ORDER_STATUS,
  })
  orderStatus: OrderStatusType;

  @ApiProperty()
  numberOfOrder: number;
}

class ProductByCategoryDto {
  @ApiProperty()
  numberOfProduct: number;

  @ApiProperty()
  isVehicle: boolean;
}

export class OverallStatisticResponseDto {
  @ApiProperty({ type: () => [OrderByStatusDto] })
  orderByStatus: OrderByStatusDto[];

  @ApiProperty({ type: () => [ProductByCategoryDto] })
  numberOfProductByCategory: ProductByCategoryDto[];

  @ApiProperty()
  totalAccessCount: number;
}
