import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodType } from '../../../../constants';

export class AddPaymentMethodDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: PaymentMethodType;

  @ApiProperty()
  accountNumber: string;

  @ApiProperty()
  userId: number;
}
