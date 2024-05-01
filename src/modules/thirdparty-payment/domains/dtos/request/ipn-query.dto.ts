import { ApiProperty } from '@nestjs/swagger';

export class IpnQueryDto {
  @ApiProperty()
  vnp_Amount: string;

  @ApiProperty()
  vnp_BankCode: string;

  @ApiProperty()
  vnp_BankTranNo: string;

  @ApiProperty()
  vnp_CardType: string;

  @ApiProperty()
  vnp_OrderInfo: string;

  @ApiProperty()
  vnp_PayDate: string;

  @ApiProperty()
  vnp_ResponseCode: string;

  @ApiProperty()
  vnp_TmnCode: string;

  @ApiProperty()
  vnp_TransactionNo: string;

  @ApiProperty()
  vnp_TransactionStatus: string;

  @ApiProperty()
  vnp_TxnRef: string;

  @ApiProperty()
  vnp_SecureHash: string;
}
