import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UserUpdatePendingOrderDto {
  @ApiProperty()
  @IsNumber()
  orderId: number;

  @ApiPropertyOptional()
  rentTime?: Date;

  @ApiPropertyOptional()
  returnTime?: Date;

  @ApiPropertyOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiProperty()
  @IsBoolean()
  isCanceled: boolean;
}
