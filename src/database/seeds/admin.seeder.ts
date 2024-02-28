import { ConfigService } from '@nestjs/config';
import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';
import { AdminEntity } from './../../modules/admin/domains/entities/admin.entity';
import { config } from 'dotenv';
import { generateHash } from './../../common/utils';

config();
const configService = new ConfigService();

export default class AdminSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const adminRepository = dataSource.getRepository(AdminEntity);
    await adminRepository.insert([
      {
        userName: 'admin',
        password: generateHash('12345678'),
        email: configService.get('ADMIN_EMAIL'),
      },
    ]);
  }
}
