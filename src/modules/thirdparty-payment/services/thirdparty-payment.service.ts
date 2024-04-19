import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { OrderService } from '@/modules/order/services/order.service';
import { CreateTransactionDto } from '@/modules/thirdparty-payment/domains/dtos/request/order-transaction.dto';
import { ThirdpartyPaymentRepository } from '@/modules/thirdparty-payment/repositories/thirdparty-payment.repository';
import {
  GATEWAY_STRATEGIES,
  PaymentGateway,
  VnPayGateway,
} from '@/modules/thirdparty-payment/strategies/thirdparty-payment.strategy';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Injectable()
export class ThirdpartyPaymentService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly configService: ApiConfigService,
    private readonly thirdpartyPaymentRepository: ThirdpartyPaymentRepository,
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
   * TODO: redirect handler, called by thirdparty
   * @description Update order payment_status after being called
   * @redirect Redirect to FE thankyou page upon successfully update the order
   * @notice Consider moving to VnPayStrategy.callback after refactoring
   */
}
