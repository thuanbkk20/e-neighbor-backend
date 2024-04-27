import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@/common/abstract.entity';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';

@Entity('thirdparty-payment')
export class ThirdpartyPaymentEntity extends AbstractEntity {
  @Column()
  merchantId: number;

  @Column()
  merchantName: string;

  @Column()
  amount: number;

  @Column()
  message: string;

  @Column()
  bank: string;

  @Column()
  transactionId: string;

  @OneToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn()
  order: OrderEntity;
}
