import * as crypto from 'crypto';

import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject } from '@nestjs/common';
import * as querystring from 'qs';
import { DataSource } from 'typeorm';

import {
  INP_ORDER_ALREADY_PAID,
  IPN_FAIL_CHECKSUM,
  IPN_INVALID_AMOUNT,
  IPN_ORDER_NOT_FOUND,
  IPN_SUCCESS,
  IPN_UNKNOWN_ERROR,
  PAYMENT_STATUS,
} from '@/constants';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { OrderService } from '@/modules/order/services/order.service';
import { CreateVNPayTransactionDto } from '@/modules/thirdparty-payment/domains/dtos/request/gateway-vnpay.dto';
import { IpnQueryDto } from '@/modules/thirdparty-payment/domains/dtos/request/ipn-query.dto';
import { CreateTransactionDto } from '@/modules/thirdparty-payment/domains/dtos/request/order-transaction.dto';
import { ThirdpartyPaymentEntity } from '@/modules/thirdparty-payment/domains/entities/payment.entity';
import { ThirdpartyPaymentRepository } from '@/modules/thirdparty-payment/repositories/thirdparty-payment.repository';
import { ApiConfigService } from '@/shared/services/api-config.service';

export abstract class PaymentGateway {
  abstract processPayment(
    transactionInfo: CreateTransactionDto,
    userIp: string,
  ): Promise<string>;

  abstract saveTransaction(params: IpnQueryDto): Promise<any>;
}

//Maybe you want to add support for a new payment Method 🤔 👇
export class VnPayGateway implements PaymentGateway {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly configService: ApiConfigService,
    private readonly thirdpartyPaymentRepository: ThirdpartyPaymentRepository,
    private readonly dataSource: DataSource,
  ) {}

  private sortObject(obj: CreateVNPayTransactionDto | IpnQueryDto) {
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

  private async verifyIpnChecksum(
    ipnData: IpnQueryDto,
    secretKey: string,
  ): Promise<boolean> {
    // Step 1: Extract the IPN data
    const sortedIpnData = this.sortObject(ipnData); // Assuming you have a sortObject function similar to your transaction sorting

    // Step 2: Calculate the checksum
    const signData = querystring.stringify(sortedIpnData, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const calculatedChecksum = hmac
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    // Step 3: Compare the calculated checksum with the IPN checksum
    return calculatedChecksum === ipnData.vnp_SecureHash;
  }

  /**
   * Saves the transaction details and updates the order payment status.
   * @param params The IPN query parameters.
   * @returns The IPN status after processing.
   */
  async saveTransaction(params: IpnQueryDto) {
    const orderId: number = parseInt(params.vnp_TxnRef);
    const hashSecret = this.configService.vnPayConfig.vnpHashSecret;
    let order = new OrderEntity();
    try {
      order = await this.orderService.findOrderEntityById(orderId);
    } catch {
      return IPN_ORDER_NOT_FOUND;
    }
    if (order.paymentStatus == PAYMENT_STATUS.COMPLETE) {
      return INP_ORDER_ALREADY_PAID;
    }
    if (order.orderValue != parseInt(params.vnp_Amount) / 100) {
      return IPN_INVALID_AMOUNT;
    }
    if (!this.verifyIpnChecksum(params, hashSecret)) {
      return IPN_FAIL_CHECKSUM;
    }
    // update order payment status and save new ThirdpartyPaymentEntity
    try {
      order.paymentStatus = PAYMENT_STATUS.COMPLETE;
      const paymentEntity = new ThirdpartyPaymentEntity();
      paymentEntity.merchantId = order.product.lessor.id; // suppose that merchantID = lessor.id
      paymentEntity.merchantName = order.product.lessor.shopName;
      paymentEntity.amount = parseInt(params.vnp_Amount);
      paymentEntity.message = params.vnp_OrderInfo;
      paymentEntity.bank = params.vnp_BankCode;
      paymentEntity.transactionId = params.vnp_TransactionNo;
      paymentEntity.order = order;
      // start transaction
      await this.dataSource.transaction(async (manager) => {
        await manager.save(order);
        await manager.save(paymentEntity);
      });
    } catch {
      return IPN_UNKNOWN_ERROR;
    }
    return IPN_SUCCESS;
  }
}

export enum GATEWAY_STRATEGIES {
  vnpay = 'VNPAY',
}

export enum LOCALE {
  vn = 'vn',
  en = 'en',
}
