import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { ProductEntity } from './product.entity';

import { AbstractEntity } from '@/common/abstract.entity';

@Entity('insurance')
export class InsuranceEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array')
  images: string[];

  @Column()
  issueDate: Date;

  @Column()
  expirationDate: Date;

  @OneToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
