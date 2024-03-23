import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '@/common/abstract.entity';
import { ProductSurChargeEntity } from '@/modules/product/domains/entities/product-surcharge.entity';

@Entity('surcharge')
export class SurchargeEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => ProductSurChargeEntity,
    (productSurcharge) => productSurcharge.surcharge,
  )
  productSurcharges: ProductSurChargeEntity[];
}
