import { Column, Entity, JoinColumn, OneToMany, ManyToOne } from 'typeorm';

import { ProductSurChargeEntity } from './product-surcharge.entity';

import { AbstractEntity } from '@/common/abstract.entity';
import { MORTGAGE, MortgageType } from '@/constants';
import {
  REQUIRED_DOCUMENTS,
  RequiredDocumentsType,
} from '@/constants/required-documents';
import { STATUS, StatusType } from '@/constants/status';
import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';
import { CategoryEntity } from '@/modules/category/domains/entities/category.entity';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { Characteristics } from '@/modules/product/domains/classes/policy.class';
@Entity('products')
export class ProductEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.AVAILABLE,
  })
  status: StatusType;

  @Column({
    type: 'enum',
    enum: MORTGAGE,
    default: MORTGAGE.NONE,
  })
  mortgage: MortgageType;

  @Column()
  description: string;

  @Column()
  value: number;

  @Column('simple-array')
  policies: string[];

  @Column('simple-array')
  images: string[];

  @Column('simple-json')
  characteristics: Characteristics[];

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: REQUIRED_DOCUMENTS,
    default: REQUIRED_DOCUMENTS.NONE,
  })
  requiredDocuments: RequiredDocumentsType;

  @Column({
    type: 'enum',
    enum: TIME_UNIT,
    default: TIME_UNIT.DAY,
  })
  timeUnit: TimeUnitType;

  @Column({
    nullable: true,
  })
  rejectReason: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(
    () => ProductSurChargeEntity,
    (productSurcharge) => productSurcharge.product,
  )
  productSurcharges: ProductSurChargeEntity[];

  @Column({ type: Boolean, default: false })
  isConfirmed: boolean;

  @ManyToOne(() => LessorEntity, (lessor) => lessor.products)
  @JoinColumn({ name: 'lessor_id', referencedColumnName: 'id' })
  lessor: LessorEntity;

  /// Traffic count
  @Column()
  accessCount: number;

  // Calculated each time a feedback is update
  @Column()
  rating: number;

  @OneToMany(() => OrderEntity, (order) => order.product)
  orders: OrderEntity[];
}
