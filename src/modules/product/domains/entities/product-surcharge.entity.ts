import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import { ProductEntity } from './product.entity';
import { Exclude } from 'class-transformer';
import { SurchargeEntity } from '../../../surcharge/domains/entities/surcharge.entity';

@Entity('product_surcharge')
export class ProductSurChargeEntity extends AbstractEntity {
  @Column()
  price: number;

  @Exclude()
  @ManyToOne(() => SurchargeEntity, (surcharge) => surcharge.productSurcharges)
  @JoinColumn({ name: 'surcharge_id' })
  surcharge: SurchargeEntity;

  @Exclude()
  @ManyToOne(() => ProductEntity, (product) => product.productSurcharges)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
