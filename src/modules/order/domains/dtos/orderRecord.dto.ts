import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ORDER_STATUS,
  OrderStatusType,
  PAYMENT_STATUS,
  PaymentStatusType,
} from '@/constants';
import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { RentalFeeEntity } from '@/modules/order/domains/entities/rental-fee.entity';
import { PaymentEntity } from '@/modules/payment/domains/entities/payment.entity';
import { UserDto } from '@/modules/user/domains/dtos/user.dto';

export class OrderRecordDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  lessorId: number;

  @ApiProperty()
  shopName: string;

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

  @ApiProperty({ type: String, isArray: true })
  imagesUponReceipt: string[];

  @ApiProperty()
  conditionUponReturn: string;

  @ApiProperty({ type: String, isArray: true })
  imagesUponReturn: string[];

  @ApiProperty()
  deliveryAddress: string;

  @ApiProperty()
  orderValue: number;

  @ApiProperty({
    type: 'enum',
    enum: ORDER_STATUS,
  })
  orderStatus: OrderStatusType;

  @ApiProperty({ type: 'enum', enum: PAYMENT_STATUS })
  paymentStatus: PaymentStatusType;

  @ApiProperty()
  rentPrice: number;

  @ApiProperty({ type: 'enum', enum: TIME_UNIT })
  timeUnit: TimeUnitType;

  @ApiPropertyOptional()
  rejectReason?: string;

  @ApiProperty() // May undergo update
  rentalFees: RentalFeeEntity[];

  @ApiProperty() // May undergo update
  payment: PaymentEntity;

  @ApiProperty()
  user: UserDto;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.productId = order.product?.id;
    this.productName = order.product?.name;
    this.lessorId = order.product?.lessor?.id;
    this.shopName = order.product?.lessor?.shopName;
    this.rentTime = order.rentTime;
    this.returnTime = order.returnTime;
    this.realRentTime = order.realRentTime;
    this.realReturnTime = order.realReturnTime;
    this.conditionUponReceipt = order.conditionUponReceipt;
    this.imagesUponReceipt = order.imagesUponReceipt;
    this.deliveryAddress = order.deliveryAddress;
    this.orderValue = order.orderValue;
    this.orderStatus = order.orderStatus;
    this.paymentStatus = order.paymentStatus;
    this.rentPrice = order.rentPrice;
    this.timeUnit = order.timeUnit;
    this.rejectReason = order.rejectReason;
    this.rentalFees = order.rentalFees;
    this.payment = order.payment;
    this.user = new UserDto(order.user);
  }
}
