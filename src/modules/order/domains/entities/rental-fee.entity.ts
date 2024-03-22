import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@/common/abstract.entity';
import { IsInt, Min } from 'class-validator';
import { Exclude } from 'class-transformer';
import { OrderEntity } from './order.entity';

@Entity('rental_fee')
export class RentalFeeEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  @IsInt()
  @Min(0)
  amount: number;

  @Exclude()
  @ManyToOne(() => OrderEntity, (order) => order.rentalFees)
  @JoinColumn({ name: 'product_id' })
  order: OrderEntity;
}
