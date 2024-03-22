import { Injectable } from '@nestjs/common';

import { SurchargeEntity } from '@/modules/surcharge/domains/entities/surcharge.entity';
import { SurchargeRepository } from '@/modules/surcharge/repositories/surcharge.repository';

@Injectable()
export class SurchargeService {
  constructor(private readonly surchargeRepository: SurchargeRepository) {}

  async getAllSurcharges(): Promise<SurchargeEntity[]> {
    return this.surchargeRepository.find();
  }

  async getSurchargeById(id: number): Promise<SurchargeEntity> {
    return this.surchargeRepository.findOneBy({ id: id });
  }

  async getSurchargeByName(name: string): Promise<SurchargeEntity> {
    return this.surchargeRepository.findOneBy({ name: name });
  }

  async getByProductSurchargeId(id: number): Promise<SurchargeEntity> {
    return this.surchargeRepository.getByProductSurchargeId(id);
  }
}
