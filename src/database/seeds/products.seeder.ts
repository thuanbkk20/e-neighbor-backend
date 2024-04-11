import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { REQUIRED_DOCUMENTS, MORTGAGE } from '@/constants';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const productDir = dataSource.getRepository(ProductEntity);
    await productDir.insert([
      {
        name: 'Toyota Camry 2023',
        description:
          'Spacious and fuel-efficient sedan, perfect for comfortable rides in the city or on road trips.',
        value: 85000000, // Adjust the value as needed
        policies: [
          'No smoking inside the car',
          'Pets allowed with prior approval',
          'Mileage limit: 200 kilometers per day (additional charges apply)',
        ],
        images: [
          'https://www.koonstoyotatysonscorner.com/blogs/4498/wp-content/uploads/2022/11/2023-Toyota-Camry.webp',
          'https://banxemoi.com.vn/wp-content/uploads/2022/09/noi-that-xe-toyota-camry-2023-moi.jpg',
          'https://binhduong.toyota.com.vn/upload/anh_1_3.jpg',
        ], // Replace with your image URLs
        characteristics: [
          { localeId: 'vehicle-characteristics-seats', description: '5' },
          {
            localeId: 'vehicle-characteristics-fuel',
            description: 'Gasoline',
          },
          {
            localeId: 'vehicle-characteristics-weight',
            description: '1496 kg',
          },
          {
            localeId: 'vehicle-characteristics-utility-GPS',
            description: 'Included',
          },
          {
            localeId: 'vehicle-characteristics-utility-backCamera',
            description: 'Included',
          },
          {
            localeId: 'vehicle-characteristics-utility-airBag',
            description: 'Included',
          },
        ],
        price: 800000, // Price per unit of time (assuming your timeUnit is set to DAY by default)
        requiredDocuments: REQUIRED_DOCUMENTS.OPTION1,
        mortgage: MORTGAGE.OPTION1,
        category: { id: 8 }, // Assuming you have a category with ID 8 for "Cars"
        lessor: { id: 1 }, // Assuming you have a lessor with ID 1
        rating: 0,
        accessCount: 0,
        isConfirmed: true,
      },
      {
        name: 'Honda CR-V 2022',
        description:
          'Compact SUV with plenty of cargo space, ideal for outdoor adventures or small families.',
        value: 998000000, // Adjust the value as needed
        policies: [
          'No off-road driving',
          'Cleaning fee applies for excessive dirt',
        ],
        images: [
          'https://danviet.mediacdn.vn/296231569849192448/2022/2/7/khoi-dong-nam-moi-gia-lan-banh-xe-honda-cr-v-2022-giam-sau-nho-uu-dai-ca-tram-trieu-dong-danvietvn-3-1644244507524638791136.jpg',
          'https://icdn.24h.com.vn/upload/1-2022/images/2022-02-25/image3-1645754800-13-width660height420.jpg',
          'https://hondaotobinhduong.net/wp-content/uploads/2022/12/honda-crv-2022-mau-trang-.jpg',
        ], // Replace with your image URLs
        characteristics: [
          {
            localeId: 'vehicle-characteristics-seats',
            description: '7',
          },
          {
            localeId: 'vehicle-characteristics-fuel',
            description: 'Gasoline',
          },
          {
            localeId: 'vehicle-characteristics-utility-GPS',
            description: 'Included',
          },
          {
            localeId: 'vehicle-characteristics-weight',
            description: '1587 kg',
          },
          {
            localeId: 'vehicle-characteristics-utility-bluetooth',
            description: 'Included',
          },
          {
            localeId: 'vehicle-characteristics-utility-backCamera',
            description: 'Included',
          },
          {
            localeId: 'vehicle-characteristics-utility-GPS',
            description: 'Included',
          },
        ],
        price: 950000, // Price per unit of time
        requiredDocuments: REQUIRED_DOCUMENTS.OPTION1,
        category: { id: 8 }, // Assuming you have a category with ID 8 for "Cars"
        lessor: { id: 1 }, // Assuming you have a lessor with ID 2
        rating: 0,
        accessCount: 0,
        isConfirmed: true,
      },
      // Add more car objects as needed
    ]);
  }
}
