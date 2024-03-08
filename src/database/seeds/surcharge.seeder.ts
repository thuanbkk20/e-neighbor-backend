import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';
import { SurchargeEntity } from '../../modules/surcharge/domains/entities/surcharge.entity';

export default class SurchargeSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const surchargeRepository = dataSource.getRepository(SurchargeEntity);
    await surchargeRepository.insert([
      {
        name: 'Phí thuê quá giờ',
        description:
          'Phụ phí phát sinh nếu hoàn trả sản phẩm trễ giờ, số tiền phạt tương ứng với số giờ trễ',
      },
      {
        name: 'Phí vệ sinh',
        description:
          'Phụ phí phát sinh khi sản phẩm hoàn trả không đảm bảo vệ sinh (nhiều vết bẩn, ám mùi,...)',
      },
      {
        name: 'Phí tổn hại sản phẩm',
        description:
          'Phụ phí phát sinh khi sản phẩm hoàn trả bị tổn hại, sản phẩm không cho thuê được nữa hoặc chủ sản phẩm phải mang đi sửa chữa, trường hợp này bên thuê bồi thường cho chủ sản phẩm theo thỏa thuận',
      },
    ]);
  }
}
