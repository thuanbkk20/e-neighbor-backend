import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';

import { CategoryEntity } from '@/modules/category/domains/entities/category.entity';

export default class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const furnitureCharsBase = [
      'furniture-characteristics-quantity',
      'furniture-characteristics-function',
      'furniture-characteristics-brand',
      'furniture-characteristics-origin',
      'furniture-characteristics-warranty-type',
      'furniture-characteristics-warranty-date',
    ];

    const furnitureChars = [
      'furniture-characteristics-size',
      'furniture-characteristics-height',
      'furniture-characteristics-material',
      'furniture-characteristics-shape',
      'furniture-characteristics-weight',
      ...furnitureCharsBase,
    ];

    const furnitureToolsChars = [
      ...furnitureChars,
      'furniture-characteristics-energyType',
    ];

    const vehicleChars = [
      'vehicle-characteristics-seats',
      'vehicle-characteristics-fuel',
      'vehicle-characteristics-fuelRate',
      'vehicle-characteristics-utility-GPS',
      'vehicle-characteristics-weight',
    ];

    const carChars = [
      'vehicle-characteristics-utility-bluetooth',
      'vehicle-characteristics-utility-obstacleSensor',
      'vehicle-characteristics-utility-usb',
      'vehicle-characteristics-utility-dashcam',
      'vehicle-characteristics-utility-speedChart',
      'vehicle-characteristics-utility-sparewheel',
      'vehicle-characteristics-utility-backCamera',
      'vehicle-characteristics-utility-sunRoof',
      'vehicle-characteristics-utility-etc',
      'vehicle-characteristics-utility-tyreSensor',
      'vehicle-characteristics-utility-airBag',
    ];
    const categoryRepository = dataSource.getRepository(CategoryEntity);
    await categoryRepository.insert([
      {
        name: 'furniture.category.couch',
        isVehicle: false,
        products: [],
        characteristics: furnitureChars,
      },
      {
        name: 'furniture.category.table',
        isVehicle: false,
        products: [],
        characteristics: furnitureChars,
      },
      {
        name: 'furniture.category.electronic',
        isVehicle: false,
        products: [],
        characteristics: furnitureToolsChars,
      },
      {
        name: 'furniture.category.decorations',
        isVehicle: false,
        products: [],
        characteristics: furnitureCharsBase,
      },
      {
        name: 'furniture.category.bed',
        isVehicle: false,
        products: [],
        characteristics: furnitureChars,
      },
      {
        name: 'furniture.category.cabinet',
        isVehicle: false,
        products: [],
        characteristics: furnitureChars,
      },
      {
        name: 'furniture.category.kitchen-appliances',
        isVehicle: false,
        products: [],
        characteristics: furnitureToolsChars,
      },
      {
        name: 'vehicle.category.car',
        isVehicle: true,
        products: [],
        characteristics: carChars,
      },
      {
        name: 'vehicle.category.motorbike',
        isVehicle: true,
        products: [],
        characteristics: vehicleChars,
      },
      {
        name: 'vehicle.category.bike',
        isVehicle: true,
        products: [],
        characteristics: vehicleChars,
      },
    ]);
  }
}
