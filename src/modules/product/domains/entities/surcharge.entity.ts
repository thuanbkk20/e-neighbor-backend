import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import { ProductEntity } from './product.entity';

@Entity('surcharge')
export class SurChargeEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @ManyToOne(() => ProductEntity, (product) => product.surcharge)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
