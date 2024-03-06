import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import { PaymentMethodEntity } from './payment-method.entity';
import { OrderEntity } from '../../../order/domains/entities/order.entity';
import {
  PAYMENT_TYPE,
  PaymentTypeType,
} from '../../../../constants/payment-type';

@Entity('payment')
export class PaymentEntity extends AbstractEntity {
  @Column()
  paymentAmount: number;

  @Column({
    type: 'enum',
    enum: PAYMENT_TYPE,
    default: PAYMENT_TYPE.ORDER,
  })
  paymentType: PaymentTypeType;

  @ManyToOne(() => PaymentMethodEntity, (paymentMethod) => paymentMethod.id)
  @JoinColumn()
  paymentMethod: PaymentMethodEntity;

  @OneToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn()
  order: OrderEntity;
}
