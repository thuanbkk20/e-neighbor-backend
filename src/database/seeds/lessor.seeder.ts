import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';

import { COMMON_LOCATION } from '@/constants';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';

export default class LessorSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(LessorEntity);
    await userRepository.insert([
      {
        description:
          'Dịch vụ cung cấp các mặt hàng cho thuê uy tín, chuyên nghiệp',
        wareHouseAddress:
          '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
        products: [],
        user: { id: 1 },
        shopName: 'Dịch vụ cho thuê Minh Quang',
        location: COMMON_LOCATION.HCM,
      },
    ]);
  }
}
