import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdminEntity } from '../domains/entities/admin.entity';

@Injectable()
export class AdminRepository extends Repository<AdminEntity> {
  constructor(private dataSource: DataSource) {
    super(AdminEntity, dataSource.createEntityManager());
  }

  async findByUserName(userName: string): Promise<AdminEntity | null> {
    return this.findOneBy({
      userName: userName,
    });
  }
}
