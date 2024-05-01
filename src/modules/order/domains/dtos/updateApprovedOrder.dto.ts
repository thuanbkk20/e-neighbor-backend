import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateApprovedOrderDto {
  @ApiProperty()
  orderId: number;

  // If this field is true, realRentTime will be set equal to rentTime otherwise realRentTime will be set equal to current time
  @ApiProperty()
  isDeliveryOnTime: boolean;

  @ApiPropertyOptional()
  conditionUponReceipt?: string;

  @ApiPropertyOptional({ isArray: true, default: [] })
  imagesUponReceipt?: string[];
}
