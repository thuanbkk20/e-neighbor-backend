import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import {
  GATEWAY_STRATEGIES,
  LOCALE,
} from '@/modules/thirdparty-payment/strategies/thirdparty-payment.strategy';

export class CreateTransactionDto {
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

  @ApiProperty({ type: 'enum', enum: GATEWAY_STRATEGIES })
  @IsEnum(GATEWAY_STRATEGIES)
  strategy: GATEWAY_STRATEGIES;

  @ApiProperty({ type: 'enum', enum: LOCALE })
  @IsEnum(LOCALE)
  locale: LOCALE;
}
