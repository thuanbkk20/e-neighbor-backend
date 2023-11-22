import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../../common/abstract.entity';

@Entity('category')
export class CategoryEntity extends AbstractEntity {
  @Column()
  name: string;
}
