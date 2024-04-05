import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@/common/abstract.entity';
import { ROLE } from '@/constants';

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
}
