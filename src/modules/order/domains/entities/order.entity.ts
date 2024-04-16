import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { RentalFeeEntity } from './rental-fee.entity';

import { AbstractEntity } from '@/common/abstract.entity';
import {
  ORDER_STATUS,
  OrderStatusType,
  PAYMENT_STATUS,
  PaymentStatusType,
} from '@/constants';
import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';
import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';
import { PaymentEntity } from '@/modules/payment/domains/entities/payment.entity';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';

@Entity('orders')
export class OrderEntity extends AbstractEntity {
  @Column()
  rentTime: Date;

  @Column()
  returnTime: Date;

  @Column({ nullable: true })
  realRentTime: Date;

  @Column({ nullable: true })
  realReturnTime: Date;

  @Column({ nullable: true })
  conditionUponReceipt: string;

  @Column('simple-array', { nullable: true })
  imagesUponReceipt: string[];

  @Column({ nullable: true })
  conditionUponReturn: string;

  @Column('simple-array', { nullable: true })
  imagesUponReturn: string[];

  @Column('simple-array')
  deliveryAddress: string;

  @Column({ default: 0 })
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

  @Column({ default: 0 })
  rentPrice: number;

  @Column({
    type: 'enum',
    enum: TIME_UNIT,
    default: TIME_UNIT.DAY,
  })
  timeUnit: TimeUnitType;

  @Column({ nullable: true })
  rejectReason?: string;

  @OneToMany(() => RentalFeeEntity, (rentalFee) => rentalFee.order)
  rentalFees: RentalFeeEntity[];

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  product: ProductEntity;

  @OneToOne(() => FeedbackEntity, (feedback) => feedback.id)
  @JoinColumn()
  feedback: FeedbackEntity;

  @OneToOne(() => PaymentEntity, (payment) => payment.id)
  @JoinColumn()
  payment: PaymentEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;
}
