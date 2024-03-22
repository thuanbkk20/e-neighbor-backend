import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';

import { CategoryEntity } from '@/modules/category/domains/entities/category.entity';

export default class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const categoryRepository = dataSource.getRepository(CategoryEntity);
    await categoryRepository.insert([
      {
        name: 'Cough/Chair',
        isVehicle: false,
        products: [],
      },
      {
        name: 'Table/Desk',
        isVehicle: false,
        products: [],
      },
      {
        name: 'Electronic Devices',
        isVehicle: false,
        products: [],
      },
      {
        name: 'Decorations',
        isVehicle: false,
        products: [],
      },
      {
        name: 'Bed',
        isVehicle: false,
        products: [],
      },
      {
        name: 'Cabinet',
        isVehicle: false,
        products: [],
      },
      {
        name: 'Kitchen Appliances',
        isVehicle: false,
        products: [],
      },
      {
        name: 'Car',
        isVehicle: true,
        products: [],
      },
      {
        name: 'Mortorcycle',
        isVehicle: true,
        products: [],
      },
      {
        name: 'Bike',
        isVehicle: true,
        products: [],
      },
    ]);
  }
}
