import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { OrderService } from '@/modules/order/services/order.service';
import { IpnQueryDto } from '@/modules/thirdparty-payment/domains/dtos/request/ipn-query.dto';
import { CreateTransactionDto } from '@/modules/thirdparty-payment/domains/dtos/request/order-transaction.dto';
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
        this.dataSource,
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

  async saveVnPayTransaction(params: IpnQueryDto) {
    return this.paymentGateways[GATEWAY_STRATEGIES.vnpay].saveTransaction(
      params,
    );
  }
}
