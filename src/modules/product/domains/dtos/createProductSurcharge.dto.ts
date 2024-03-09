import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateProductSurchargeDto {
  @ApiProperty()
  @IsNumber()
  surchargeId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
