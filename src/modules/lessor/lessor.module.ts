import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { LessorController } from './controllers/lessor.controller';
import { LessorRepository } from './repositories/lessor.repository';
import { LessorService } from './services/lessor.service';

import { AdminModule } from '@/modules/admin/admin.module';
import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';
import { FeedbackRepository } from '@/modules/feedback/repositories/feedback.repository';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { PaymentModule } from '@/modules/payment/payment.module';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';
import { ProductRepository } from '@/modules/product/repositories/product.reposiory';
import { UserModule } from '@/modules/user/user.module';

@Module({
  controllers: [LessorController],
  imports: [
    UserModule,
    AdminModule,
    PaymentModule,
    TypeOrmModule.forFeature([FeedbackRepository]),
  ],
  exports: [LessorService],
  providers: [
    {
      provide: getRepositoryToken(FeedbackEntity),
      inject: [getDataSourceToken()],
      useFactory(datasource: DataSource) {
        return datasource
          .getRepository(FeedbackEntity)
          .extend(FeedbackRepository);
      },
    },
    {
      provide: getRepositoryToken(OrderEntity),
      inject: [getDataSourceToken()],
      useFactory(datasource: DataSource) {
        return datasource.getRepository(OrderEntity).extend(OrderRepository);
      },
    },
    {
      provide: getRepositoryToken(ProductEntity),
      inject: [getDataSourceToken()],
      useFactory(datasource: DataSource) {
        return datasource
          .getRepository(ProductEntity)
          .extend(ProductRepository);
      },
    },
    LessorService,
    LessorRepository,
  ],
})
export class LessorModule {}
