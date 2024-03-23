import { Module } from '@nestjs/common';

import { PaymentRepository } from './repositories/payment.repository';
import { PaymentService } from './services/payment.service';

@Module({
  exports: [PaymentService],
  providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
