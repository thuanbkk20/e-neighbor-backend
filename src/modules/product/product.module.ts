import { CategoryModule } from './../category/category.module';
import { Module } from '@nestjs/common';
import { ProductController } from './controllers/productController';
import { ProductRepository } from './repositories/product.reposiory';
import { ProductService } from './services/product.service';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';
import { LessorModule } from '../lessor/lessor.module';
import { ProductSurchargeRepository } from './repositories/product-surcharge.repository';
import { InsuranceRepository } from './repositories/insurance.repository';

@Module({
  imports: [CategoryModule, UserModule, AdminModule, LessorModule],
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
