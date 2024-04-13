import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  rentTime: Date;

  @ApiProperty()
  returnTime: Date;

  @ApiProperty()
  @IsString()
  deliveryAddress: string;
}
