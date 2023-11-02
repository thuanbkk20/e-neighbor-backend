import { AdminNotFoundException } from 'src/exceptions/admin-not-found.exception';
import { AdminEntity } from '../domains/entities/admin.entity';
import { AdminRepository } from './../repositories/admin.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

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
