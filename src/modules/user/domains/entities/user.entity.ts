import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '@/common/abstract.entity';
import { ROLE } from '@/constants';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  detailedAddress: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ default: ROLE.USER })
  role: string;

  @Column({ nullable: true })
  citizenId: string;

  @Column({ nullable: true })
  citizenCardFront: string;

  @Column({ nullable: true })
  citizenCardBack: string;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @Column({ default: 0 })
  wallet: number;
}
