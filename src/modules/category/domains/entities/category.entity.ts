import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '@/common/abstract.entity';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';

@Entity('category')
export class CategoryEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  isVehicle: boolean;

  @Column('simple-array', { default: [] })
  characteristics: string[];

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
