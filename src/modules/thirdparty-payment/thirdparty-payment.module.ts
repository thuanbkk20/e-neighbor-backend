import { forwardRef, Module } from '@nestjs/common';

import { AdminModule } from '@/modules/admin/admin.module';
import { LessorModule } from '@/modules/lessor/lessor.module';
import { OrderModule } from '@/modules/order/order.module';
import { ThirdpartyPaymentController } from '@/modules/thirdparty-payment/controllers/thirdparty-payment.controller';
import { ThirdpartyPaymentRepository } from '@/modules/thirdparty-payment/repositories/thirdparty-payment.repository';
import { ThirdpartyPaymentService } from '@/modules/thirdparty-payment/services/thirdparty-payment.service';
import { UserModule } from '@/modules/user/user.module';

@Module({
  exports: [ThirdpartyPaymentService],
  providers: [ThirdpartyPaymentService, ThirdpartyPaymentRepository],
  imports: [
    UserModule,
    AdminModule,
    LessorModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [ThirdpartyPaymentController],
})
export class ThirdpartyPaymentModule {}
