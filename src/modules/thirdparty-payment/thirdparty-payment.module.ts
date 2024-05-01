import { forwardRef, Module } from '@nestjs/common';

import { AdminModule } from '@/modules/admin/admin.module';
import { LessorModule } from '@/modules/lessor/lessor.module';
import { OrderModule } from '@/modules/order/order.module';
import { ThirdPartyPaymentController } from '@/modules/thirdparty-payment/controllers/thirdparty-payment.controller';
import { ThirdpartyPaymentRepository } from '@/modules/thirdparty-payment/repositories/thirdparty-payment.repository';
import { ThirdPartyPaymentService } from '@/modules/thirdparty-payment/services/thirdparty-payment.service';
import { UserModule } from '@/modules/user/user.module';

@Module({
  exports: [ThirdPartyPaymentService],
  providers: [ThirdPartyPaymentService, ThirdpartyPaymentRepository],
  imports: [
    UserModule,
    AdminModule,
    LessorModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [ThirdPartyPaymentController],
})
export class ThirdpartyPaymentModule {}
