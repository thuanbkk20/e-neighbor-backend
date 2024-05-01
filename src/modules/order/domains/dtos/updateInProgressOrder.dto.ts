import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInProgressOrderDto {
  @ApiProperty()
  orderId: number;

  // If this field is true, realReturnTime will be set equal to returnTime otherwise realRentTime will be set equal to current time
  @ApiProperty()
  isReturnOnTime: boolean;

  @ApiPropertyOptional()
  conditionUponReturn?: string;

  @ApiProperty({ isArray: true, default: [] })
  imagesUponReturn: string[];
}
