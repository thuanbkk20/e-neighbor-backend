import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@/common/abstract.entity';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';

@Entity('inboxs')
export class InboxEntity extends AbstractEntity {
  @Column()
  content: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  sender: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  receiver: UserEntity;
}
