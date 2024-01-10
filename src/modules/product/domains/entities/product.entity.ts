import {
  REQUIRED_DOCUMENTS,
  RequiredDocumentsType,
} from './../../../../constants/required-documents';
import { STATUS, StatusType } from './../../../../constants/status';
import { Column, Entity, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import { Characteristics } from '../classes/policy.class';
import { CategoryEntity } from '../../../category/domains/entities/category.entity';
import { MORTGAGE, MortgageType } from '../../../../constants';
import { TIME_UNIT, TimeUnitType } from '../../../../constants/time-unit';
import { SurChargeEntity } from './surcharge.entity';
import { Exclude } from 'class-transformer';
import { LessorEntity } from '../../../lessor/domains/entities/lessor.entity';

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

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Exclude()
  @OneToMany(() => SurChargeEntity, (surcharge) => surcharge.product)
  surcharge: SurChargeEntity[];

  @Column({ type: Boolean, default: false })
  isConfirmed: boolean;

  @ManyToOne(() => LessorEntity, (lessor) => lessor.products)
  @JoinColumn({ name: 'lessor_id' })
  lessor: LessorEntity;
}
