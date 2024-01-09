import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import { ProductEntity } from '../../../product/domains/entities/product.entity';

@Entity('category')
export class CategoryEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  isVehicle: boolean;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
