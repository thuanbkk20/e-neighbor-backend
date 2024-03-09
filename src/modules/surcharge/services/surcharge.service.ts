import { Injectable } from '@nestjs/common';
import { SurchargeRepository } from '../repositories/surcharge.repository';
import { SurchargeEntity } from '../domains/entities/surcharge.entity';

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
