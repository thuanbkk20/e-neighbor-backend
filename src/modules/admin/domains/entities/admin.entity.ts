import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@/common/abstract.entity';

@Entity('admin')
export class AdminEntity extends AbstractEntity {
  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;
}
