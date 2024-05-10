import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

import { ApiConfigService } from '@/shared/services/api-config.service';

dayjs.extend(utc);
dayjs.extend(timezone);

export class CreateVNPayTransactionDto {
  @ApiProperty()
  vnp_Version: string;

  @ApiProperty()
  vnp_Command: string;

  @ApiProperty()
  vnp_TmnCode: string;

  @ApiProperty()
  vnp_Amount: number;

  @ApiProperty()
  vnp_BankCode: string;

  @ApiProperty()
  vnp_CreateDate: string;

  @ApiProperty()
  vnp_CurrCode: string;

  @ApiProperty()
  vnp_IpAddr: string;

  @ApiProperty()
  vnp_Locale: string;

  @ApiProperty()
  vnp_OrderInfo: string;

  @ApiProperty()
  vnp_OrderType: number;

  @ApiProperty()
  vnp_ReturnUrl: string;

  @ApiProperty()
  vnp_ExpireDate: string;

  @ApiProperty()
  vnp_TxnRef: number;

  @ApiProperty()
  vnp_SecureHash: string;

  constructor(
    configService: ApiConfigService,
    amount: number,
    locale: string,
    ipAddress: string,
    orderId: number,
    isVehicle: boolean,
  ) {
    this.vnp_BankCode = configService.vnPayConfig.vnpBANKCODE;
    this.vnp_Command = 'pay';
    this.vnp_Version = configService.vnPayConfig.vnpVersion;
    this.vnp_TmnCode = configService.vnPayConfig.vnpTMNCode;
    this.vnp_Amount = amount * 100;
    this.vnp_BankCode = configService.vnPayConfig.vnpBANKCODE;
    this.vnp_CreateDate = dayjs
      .utc()
      .tz('Asia/Bangkok')
      .format('YYYYMMDDHHmmss');
    this.vnp_CurrCode = 'VND';
    this.vnp_IpAddr = ipAddress;
    this.vnp_Locale = locale;
    this.vnp_OrderInfo = `Giao dich cho Don hang ${orderId}`;
    this.vnp_OrderType = isVehicle ? 240000 : 230001;
    this.vnp_ReturnUrl = configService.vnPayConfig.vnpReturnUrl;
    this.vnp_ExpireDate = dayjs
      .utc()
      .tz('Asia/Bangkok')
      .add(15, 'minutes')
      .format('YYYYMMDDHHmmss');
    this.vnp_TxnRef = orderId;
  }
}
