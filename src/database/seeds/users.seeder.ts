import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';

import { generateHash } from '@/common/utils';
import { ROLE } from '@/constants';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.insert([
      {
        userName: 'user01',
        password: generateHash('12345678'),
        email: 'user01@gmail.com',
        address: 'Ho Chi Minh',
        detailedAddress:
          '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
        dob: new Date(1998, 6, 28, 6, 0, 0),
        phoneNumber: '012345678',
        fullName: 'Nguyễn Minh Quang',
        role: ROLE.LESSOR,
        citizenId: '0123456789',
        citizenCardFront:
          'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
        citizenCardBack:
          'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
        avatar:
          'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png',
      },
    ]);
  }
}
