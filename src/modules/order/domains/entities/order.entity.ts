import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@/common/abstract.entity';
import {
  ORDER_STATUS,
  OrderStatusType,
  PAYMENT_STATUS,
  PaymentStatusType,
} from '@/constants';
import { RentalFeeEntity } from './rental-fee.entity';

@Entity('orders')
export class OrderEntity extends AbstractEntity {
  @Column()
  rentTime: Date;

  @Column()
  returnTime: Date;

  @Column()
  realRentTime: Date;

  @Column()
  realReturnTime: Date;

  @Column()
  conditionUponReceipt: string;

  @Column('simple-array')
  imagesUponReceipt: string[];

  @Column()
  conditionUponReturn: string;

  @Column('simple-array')
  imagesUponReturn: string[];

  @Column('simple-array')
  deliveryAddress: string;

  @Column()
  orderValue: number;

  @Column({
    type: 'enum',
    enum: ORDER_STATUS,
    default: ORDER_STATUS.PENDING,
  })
  orderStatus: OrderStatusType;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.INCOMPLETE,
  })
  paymentStatus: PaymentStatusType;

  @OneToMany(() => RentalFeeEntity, (rentalFee) => rentalFee.order)
  rentalFees: RentalFeeEntity[];
}
