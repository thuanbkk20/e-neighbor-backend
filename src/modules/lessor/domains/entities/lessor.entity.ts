import { ProductEntity } from '../../../product/domains/entities/product.entity';
import { AbstractEntity } from './../../../../common/abstract.entity';
import { UserEntity } from './../../../user/domains/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('lessors')
export class LessorEntity extends AbstractEntity {
  @Column({ nullable: true })
  description: string;

  @Column()
  wareHouseAddress: string;

  @Column({ nullable: true })
  responseRate: number;

  @Column({ nullable: true })
  responseTime: number;

  @Column({ nullable: true })
  agreementRate: number;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => ProductEntity, (product) => product.lessor)
  products: ProductEntity[];
}
