import { AbstractEntity } from './../../../../common/abstract.entity';
import { ROLE } from './../../../../constants';
import { Column, Entity } from 'typeorm';

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

  @Column()
  role: ROLE = ROLE.USER;

  @Column({ nullable: true })
  CCCD: string;
}
