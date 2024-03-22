import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodType } from '@/constants';

export class UpdatePaymentMethodDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: PaymentMethodType;

  @ApiProperty()
  accountNumber: string;
}

export class AddPaymentMethodDto extends UpdatePaymentMethodDto {
  @ApiProperty()
  userId: number;
}
