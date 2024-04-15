import { ApiProperty } from '@nestjs/swagger';

import {
  ORDER_STATUS,
  OrderStatusType,
  PAYMENT_STATUS,
  PaymentStatusType,
} from '@/constants';
import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';
import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { PaymentEntity } from '@/modules/payment/domains/entities/payment.entity';
import { ProductDto } from '@/modules/product/domains/dtos/product.dto';
import { UserDto } from '@/modules/user/domains/dtos/user.dto';

export class OrderDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  rentTime: Date;

  @ApiProperty()
  returnTime: Date;

  @ApiProperty()
  realRentTime: Date;

  @ApiProperty()
  realReturnTime: Date;

  @ApiProperty()
  conditionUponReceipt: string;

  @ApiProperty()
  imagesUponReceipt: string[];

  @ApiProperty()
  conditionUponReturn: string;

  @ApiProperty()
  imagesUponReturn: string[];

  @ApiProperty()
  deliveryAddress: string;

  @ApiProperty()
  orderValue: number;

  @ApiProperty({ type: 'enum', enum: ORDER_STATUS })
  orderStatus: OrderStatusType;

  @ApiProperty({ type: 'enum', enum: PAYMENT_STATUS })
  paymentStatus: PaymentStatusType;

  @ApiProperty()
  rentPrice: number;

  @ApiProperty({ type: 'enum', enum: TIME_UNIT })
  timeUnit: TimeUnitType;

  @ApiProperty()
  product: ProductDto;

  @ApiProperty()
  feedback: FeedbackEntity;

  @ApiProperty()
  payment: PaymentEntity;

  @ApiProperty()
  user: UserDto;

  constructor(order: OrderEntity, product: ProductDto) {
    this.id = order.id;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
    this.rentTime = order.rentTime;
    this.returnTime = order.returnTime;
    this.realRentTime = order.realRentTime;
    this.realReturnTime = order.realReturnTime;
    this.conditionUponReceipt = order.conditionUponReceipt;
    this.imagesUponReceipt = order.imagesUponReceipt;
    this.conditionUponReturn = order.conditionUponReturn;
    this.imagesUponReturn = order.imagesUponReturn;
    this.deliveryAddress = order.deliveryAddress;
    this.orderValue = order.orderValue;
    this.orderStatus = order.orderStatus;
    this.paymentStatus = order.paymentStatus;
    this.rentPrice = order.rentPrice;
    this.timeUnit = order.timeUnit;
    this.feedback = order.feedback;
    this.payment = order.payment;
    this.user = new UserDto(order.user);
    this.product = product;
  }
}
