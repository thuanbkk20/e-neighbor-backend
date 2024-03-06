import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateProductSurchargeDto {
  @ApiProperty()
  @IsNumber()
  surchargeId: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}
