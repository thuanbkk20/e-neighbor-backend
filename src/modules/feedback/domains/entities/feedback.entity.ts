import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '@/common/abstract.entity';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { IsInt, Max, Min } from 'class-validator';

@Entity('feedbacks')
export class FeedbackEntity extends AbstractEntity {
  @Column()
  content: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  @IsInt({ message: 'Star rating must be an integer' })
  @Min(1, { message: 'Star rating must be at least 1' })
  @Max(5, { message: 'Star rating must be at most 5' })
  star: number;

  @OneToOne(() => OrderEntity)
  @JoinColumn()
  order: OrderEntity;
}
