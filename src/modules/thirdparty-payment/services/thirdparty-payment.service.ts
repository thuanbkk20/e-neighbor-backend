import * as crypto from 'crypto';

import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as querystring from 'qs';
import { DataSource } from 'typeorm';

import {
  INP_ORDER_ALREADY_PAID,
  IPN_ORDER_NOT_FOUND,
  IPN_SUCCESS,
  PAYMENT_STATUS,
  IPN_INVALID_AMOUNT,
  IPN_FAIL_CHECKSUM,
  IPN_UNKNOWN_ERROR,
} from '@/constants';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { OrderService } from '@/modules/order/services/order.service';
import { IpnQueryDto } from '@/modules/thirdparty-payment/domains/dtos/request/ipn-query.dto';
import { CreateTransactionDto } from '@/modules/thirdparty-payment/domains/dtos/request/order-transaction.dto';
import { ThirdpartyPaymentEntity } from '@/modules/thirdparty-payment/domains/entities/payment.entity';
import { ThirdpartyPaymentRepository } from '@/modules/thirdparty-payment/repositories/thirdparty-payment.repository';
import {
  GATEWAY_STRATEGIES,
  PaymentGateway,
  VnPayGateway,
} from '@/modules/thirdparty-payment/strategies/thirdparty-payment.strategy';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Injectable()
export class ThirdPartyPaymentService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly configService: ApiConfigService,
    private readonly thirdpartyPaymentRepository: ThirdpartyPaymentRepository,
    private readonly dataSource: DataSource,
  ) {
    this.loadGateway();
  }

  /* TODO: (minor priority)
    init payment gateway, assign to a key: string object,
    init using OCP model
    from which, client can choose a method to use (using PAYMENT_METHOD enum)
  */
  private paymentGateways: Record<string, PaymentGateway> = {};
  private loadGateway() {
    this.paymentGateways = {
      [GATEWAY_STRATEGIES.vnpay]: new VnPayGateway(
        this.httpService,
        this.orderService,
        this.configService,
        this.thirdpartyPaymentRepository,
      ),
    };
  }

  /**
   *
   * @description Generate Redirect url
   *
   * */
  async redirectPaymentGateway(
    transactionInfo: CreateTransactionDto,
    userIp: string,
  ) {
    return this.paymentGateways[transactionInfo.strategy].processPayment(
      transactionInfo,
      userIp,
    );
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

  private sortObject(obj: IpnQueryDto) {
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
}
