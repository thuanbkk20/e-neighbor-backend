import './src/boilerplate.polyfill';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';

import { SnakeNamingStrategy } from './src/snake-naming.strategy';

config();

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: Number(configService.get('DB_PORT')),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: true,
  logging: true,
  entities: [
    './src/modules/**/*.entity{.ts,.js}',
    './src/modules/**/*.view-entity{.ts,.js}',
  ],
  migrations: ['./src/database/migrations/*{.ts,.js}'],
  seeds: ['./src/database/seeds/*{.ts,.js}'],
};

export const dataSource = new DataSource(options);
