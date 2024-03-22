import { Injectable } from '@nestjs/common';

import { AdminRepository } from './../repositories/admin.repository';

import { AdminEntity } from '@/modules/admin/domains/entities/admin.entity';
import { AdminNotFoundException } from 'src/exceptions/admin-not-found.exception';

@Injectable()
export class AdminService {
  constructor(readonly adminRepository: AdminRepository) {}

  async findOneByUserName(userName: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findByUserName(userName);
    if (!admin) {
      throw new AdminNotFoundException();
    }
    return admin;
  }

  async findOneById(id: number): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({
      id: id,
    });
    if (!admin) {
      throw new AdminNotFoundException();
    }
    return admin;
  }
}
