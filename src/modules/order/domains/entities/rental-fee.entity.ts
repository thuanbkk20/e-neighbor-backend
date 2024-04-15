import { Exclude } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { OrderEntity } from './order.entity';

import { AbstractEntity } from '@/common/abstract.entity';
import { RENTAL_FEE_NAME, RentalFeeNameType } from '@/constants';

@Entity('rental_fee')
export class RentalFeeEntity extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: RENTAL_FEE_NAME,
    default: RENTAL_FEE_NAME.STANDARD,
  })
  name: RentalFeeNameType;

  @Column()
  description: string;

  @Column()
  @IsInt()
  @Min(0)
  amount: number;

  @Exclude()
  @ManyToOne(() => OrderEntity, (order) => order.rentalFees)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
