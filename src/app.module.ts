import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';
import { LessorModule } from './modules/lessor/lessor.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { SurchargeModule } from './modules/surcharge/surcharge.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        const newDataSource = addTransactionalDataSource(
          new DataSource(options),
        );

        const existedDataSource = getDataSourceByName(options.name || '');

        const dataSource = existedDataSource || newDataSource;

        return Promise.resolve(dataSource);
      },
    }),
    LessorModule,
    UserModule,
    AdminModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    SurchargeModule,
  ],
})
export class AppModule {}
