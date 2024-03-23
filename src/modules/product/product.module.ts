import { Module } from '@nestjs/common';

import { ProductController } from './controllers/product.controller';
import { InsuranceRepository } from './repositories/insurance.repository';
import { ProductSurchargeRepository } from './repositories/product-surcharge.repository';
import { ProductRepository } from './repositories/product.reposiory';
import { ProductService } from './services/product.service';

import { AdminModule } from '@/modules/admin/admin.module';
import { CategoryModule } from '@/modules/category/category.module';
import { FeedbackModule } from '@/modules/feedback/feedback.module';
import { LessorModule } from '@/modules/lessor/lessor.module';
import { OrderModule } from '@/modules/order/order.module';
import { SurchargeModule } from '@/modules/surcharge/surcharge.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    CategoryModule,
    UserModule,
    AdminModule,
    LessorModule,
    SurchargeModule,
    OrderModule,
    FeedbackModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductRepository,
    ProductService,
    ProductSurchargeRepository,
    InsuranceRepository,
  ],
  exports: [ProductService],
})
export class ProductModule {}
