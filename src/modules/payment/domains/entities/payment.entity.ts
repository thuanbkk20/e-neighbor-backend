import {
  PAYMENT_METHOD,
  PaymentMethodType,
} from './../../../../constants/payment-method';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import { UserEntity } from '../../../user/domains/entities/user.entity';

@Entity('payment_method')
export class PaymentMethodEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column({ enum: PAYMENT_METHOD })
  type: PaymentMethodType;

  @Column()
  accountNumber: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;
}
