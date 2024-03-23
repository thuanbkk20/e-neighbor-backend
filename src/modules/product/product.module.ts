import { CategoryModule } from './../category/category.module';
import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.reposiory';
import { ProductService } from './services/product.service';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';
import { LessorModule } from '../lessor/lessor.module';
import { ProductSurchargeRepository } from './repositories/product-surcharge.repository';
import { InsuranceRepository } from './repositories/insurance.repository';
import { SurchargeModule } from '../surcharge/surcharge.module';
import { OrderModule } from '../order/order.module';
import { FeedbackModule } from '../feedback/feedback.module';

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
