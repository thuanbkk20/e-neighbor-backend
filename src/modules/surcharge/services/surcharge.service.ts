import { Injectable, NotFoundException } from '@nestjs/common';

import { SurchargeEntity } from '@/modules/surcharge/domains/entities/surcharge.entity';
import { SurchargeRepository } from '@/modules/surcharge/repositories/surcharge.repository';

@Injectable()
export class SurchargeService {
  constructor(private readonly surchargeRepository: SurchargeRepository) {}

  async getAllSurcharges(): Promise<SurchargeEntity[]> {
    return this.surchargeRepository.find();
  }

  async getSurchargeById(id: number): Promise<SurchargeEntity> {
    const surcharge = await this.surchargeRepository.findOneBy({ id: id });

    if (!surcharge) {
      throw new NotFoundException('Surcharge not found!');
    }
    return surcharge;
  }

  async getSurchargeByName(name: string): Promise<SurchargeEntity> {
    const surcharge = await this.surchargeRepository.findOneBy({ name: name });

    if (!surcharge) {
      throw new NotFoundException('Surcharge not found!');
    }
    return surcharge;
  }

  async getByProductSurchargeId(id: number): Promise<SurchargeEntity> {
    return this.surchargeRepository.getByProductSurchargeId(id);
  }
}
