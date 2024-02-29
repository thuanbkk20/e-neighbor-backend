// read from .env file
import * as dotenv from 'dotenv';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
import { runSeeders } from 'typeorm-extension';

import { AdminEntity } from '../../modules/admin/domains/entities/admin.entity';
import { UserEntity } from '../../modules/user/domains/entities/user.entity';

import { SnakeNamingStrategy } from '../../snake-naming.strategy';
import AdminSeeder from './admin.seeder';
import CategorySeeder from './category.seeder';
import { CategoryEntity } from '../../modules/category/domains/entities/category.entity';
import { ProductEntity } from '../../modules/product/domains/entities/product.entity';
import { SurChargeEntity } from '../../modules/product/domains/entities/surcharge.entity';
import { LessorEntity } from '../../modules/lessor/domains/entities/lessor.entity';

dotenv.config();

async function executeSeeding() {
  const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [
      AdminEntity,
      UserEntity,
      CategoryEntity,
      ProductEntity,
      SurChargeEntity,
      LessorEntity,
    ],
    seeds: [AdminSeeder, CategorySeeder],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  await runSeeders(dataSource);
}

executeSeeding().catch(console.error);
