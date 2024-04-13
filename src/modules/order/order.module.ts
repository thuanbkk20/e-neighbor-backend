import { Module, forwardRef } from '@nestjs/common';

import { OrderController } from './controllers/order.controller';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';

import { AdminModule } from '@/modules/admin/admin.module';
import { LessorModule } from '@/modules/lessor/lessor.module';
import { ProductModule } from '@/modules/product/product.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    forwardRef(() => ProductModule),
    UserModule,
    LessorModule,
    AdminModule,
  ],
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
