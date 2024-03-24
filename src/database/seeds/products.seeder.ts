import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { ProductEntity } from '@/modules/product/domains/entities/product.entity';

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const productDir = dataSource.getRepository(ProductEntity);
    await productDir.insert([
      {
        name: 'Toyota Camry 2023',
        description:
          'Spacious and fuel-efficient sedan, perfect for comfortable rides in the city or on road trips.',
        value: 25000, // Adjust the value as needed
        policies: [
          'No smoking inside the car',
          'Pets allowed with prior approval',
          'Mileage limit: 200 kilometers per day (additional charges apply)',
        ],
        images: ['image1.jpg', 'image2.jpg', 'image3.jpg'], // Replace with your image URLs
        characteristics: [
          { localeId: 'product.characteristic.vehicle.seat', description: '5' },
          {
            localeId: 'product.characteristic.vehicle.type',
            description: 'Automatic',
          },
          {
            localeId: 'product.characteristic.vehicle.gas',
            description: 'E-95',
          },
        ],
        price: 50, // Price per unit of time (assuming your timeUnit is set to DAY by default)
        requiredDocuments: 'OPTION1',
        category: { id: 1 }, // Assuming you have a category with ID 1 for "Cars"
        lessor: { id: 1 }, // Assuming you have a lessor with ID 1
        rating: 0,
        accessCount: 0,
      },
      {
        name: 'Honda CR-V 2022',
        description:
          'Compact SUV with plenty of cargo space, ideal for outdoor adventures or small families.',
        value: 30000, // Adjust the value as needed
        policies: [
          'No off-road driving',
          'Cleaning fee applies for excessive dirt',
        ],
        images: ['image4.jpg', 'image5.jpg', 'image6.jpg'], // Replace with your image URLs
        characteristics: [
          { localeId: 'product.characteristic.vehicle.seat', description: '7' },
          {
            localeId: 'product.characteristic.vehicle.type',
            description: 'Automatic',
          },
          {
            localeId: 'product.characteristic.vehicle.gas',
            description: 'SUV',
          },
        ],
        price: 70, // Price per unit of time
        requiredDocuments: 'OPTION1',
        category: { id: 2 }, // Assuming you have a category with ID 1 for "Cars"
        lessor: { id: 1 }, // Assuming you have a lessor with ID 2
        rating: 0,
        accessCount: 0,
      },
      // Add more car objects as needed
    ]);
  }
}
