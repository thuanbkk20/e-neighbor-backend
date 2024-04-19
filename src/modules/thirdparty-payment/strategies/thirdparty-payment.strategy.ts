import * as crypto from 'crypto';

import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject } from '@nestjs/common';
import * as querystring from 'qs';

import { OrderService } from '@/modules/order/services/order.service';
import { CreateVNPayTransactionDto } from '@/modules/thirdparty-payment/domains/dtos/request/gateway-vnpay.dto';
import { CreateTransactionDto } from '@/modules/thirdparty-payment/domains/dtos/request/order-transaction.dto';
import { ThirdpartyPaymentRepository } from '@/modules/thirdparty-payment/repositories/thirdparty-payment.repository';
import { ApiConfigService } from '@/shared/services/api-config.service';

export abstract class PaymentGateway {
  abstract processPayment(
    transactionInfo: CreateTransactionDto,
    userIp: string,
  ): Promise<string>;
}

//Maybe you want to add support for a new payment Method 🤔 👇
export class VnPayGateway implements PaymentGateway {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly configService: ApiConfigService,
    private readonly thirdpartyPaymentRepository: ThirdpartyPaymentRepository,
  ) {}

  private sortObject(obj: CreateVNPayTransactionDto) {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  async processPayment(
    transactionInfo: CreateTransactionDto,
    userIp: string,
  ): Promise<string> {
    const order = await this.orderService.createOrder({
      deliveryAddress: transactionInfo.deliveryAddress,
      productId: transactionInfo.productId,
      rentTime: transactionInfo.rentTime,
      returnTime: transactionInfo.returnTime,
    });

    const transactionParams = new CreateVNPayTransactionDto(
      this.configService,
      order.paymentAmount,
      transactionInfo.locale,
      userIp,
      order.id,
      order.product.category.isVehicle,
    );

    const sortedDto = this.sortObject(transactionParams);
    const signData = querystring.stringify(sortedDto, { encode: false });
    const hmac = crypto.createHmac(
      'sha512',
      this.configService.vnPayConfig.vnpHashSecret,
    );
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedDto['vnp_SecureHash'] = signed;

    const link =
      this.configService.vnPayConfig.vnpUrl +
      '?' +
      querystring.stringify(sortedDto, { encode: false });

    return link;
  }
}

export enum GATEWAY_STRATEGIES {
  vnpay = 'VNPAY',
}

export enum LOCALE {
  vn = 'vn',
  en = 'en',
}
