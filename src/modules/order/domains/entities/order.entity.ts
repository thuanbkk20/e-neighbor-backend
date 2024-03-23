import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import {
  ORDER_STATUS,
  OrderStatusType,
  PAYMENT_STATUS,
  PaymentStatusType,
} from '../../../../constants';
import { RentalFeeEntity } from './rental-fee.entity';
import { ProductEntity } from '../../../product/domains/entities/product.entity';
import { FeedbackEntity } from '../../../feedback/domains/entities/feedback.entity';
import { PaymentEntity } from '../../../payment/domains/entities/payment.entity';

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

  @ManyToOne(() => ProductEntity, (product) => product.orders)
  product: ProductEntity;

  @OneToOne(() => FeedbackEntity, (feedback) => feedback.id)
  @JoinColumn()
  feedback: FeedbackEntity;

  @OneToOne(() => PaymentEntity, (payment) => payment.id)
  @JoinColumn()
  payment: PaymentEntity;
}
