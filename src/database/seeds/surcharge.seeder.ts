import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';

import { SurchargeEntity } from '@/modules/surcharge/domains/entities/surcharge.entity';

export default class SurchargeSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const surchargeRepository = dataSource.getRepository(SurchargeEntity);
    await surchargeRepository.insert([
      {
        name: 'products.surCharge.lateFees',
        description: 'products.surCharge.lateFees.description',
      },
      {
        name: 'products.surCharge.sanityFees',
        description: 'products.surCharge.sanityFees.description',
      },
      {
        name: 'products.surCharge.damageFees',
        description: 'products.surCharge.sanityFees.description',
      },
    ]);
  }
}
