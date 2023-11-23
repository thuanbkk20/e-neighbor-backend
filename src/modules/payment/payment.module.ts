import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  exports: [PaymentService],
  providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
