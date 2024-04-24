import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import {
  INP_ORDER_ALREADY_PAID,
  IPN_ORDER_NOT_FOUND,
  IPN_SUCCESS,
  PAYMENT_STATUS,
  IPN_INVALID_AMOUNT,
} from '@/constants';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
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

  async saveTransaction(params: IpnQueryDto) {
    const orderId: number = parseInt(params.vnp_TxnRef);
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
    return IPN_SUCCESS;
    // TODO: validate checksum, update order payment status and save new ThirdpartyPaymentEntity
  }

  /**
   * TODO: redirect handler, called by thirdparty
   * @description Update order payment_status after being called
   * @redirect Redirect to FE thankyou page upon successfully update the order
   * @notice Consider moving to VnPayStrategy.callback after refactoring
   */
}
