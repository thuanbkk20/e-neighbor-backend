import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import { ProductEntity } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity('surcharge')
export class SurChargeEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Exclude()
  @ManyToOne(() => ProductEntity, (product) => product.surcharge)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
