import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import { ProductEntity } from './product.entity';
import { SurchargeEntity } from '../../../surcharge/domains/entities/surcharge.entity';
import { IsInt, Min } from 'class-validator';

@Entity('product_surcharge')
export class ProductSurChargeEntity extends AbstractEntity {
  @Column({ default: 0 })
  @IsInt({ message: 'Star rating must be an integer' })
  @Min(0, { message: 'Surcharge must be at least 0' })
  price: number;

  @ManyToOne(() => SurchargeEntity, (surcharge) => surcharge.productSurcharges)
  @JoinColumn({ name: 'surcharge_id' })
  surcharge: SurchargeEntity;

  @ManyToOne(() => ProductEntity, (product) => product.productSurcharges)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
