import { STATUS, StatusType } from './../../../../constants/status';
import { Column, Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';
import { Characteristics } from '../classes/policy.class';
import { LessorEntity } from '../../../lessor/domains/entities/lessor.entity';
import { CategoryEntity } from '../../../category/domains/entities/category.entity';

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

  @Column({ nullable: true })
  mortgage: string;

  @Column()
  description: string;

  @Column()
  value: number;

  @Column('simple-array')
  policies: string[];

  @Column('simple-json')
  characteristics: Characteristics[];

  @Column()
  price: number;

  @OneToOne(() => LessorEntity)
  @JoinColumn()
  lessor: LessorEntity;

  @OneToMany(() => CategoryEntity, (category) => category.id)
  category: CategoryEntity[];
}
