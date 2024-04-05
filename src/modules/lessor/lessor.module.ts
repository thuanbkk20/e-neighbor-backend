import { Module } from '@nestjs/common';

import { LessorController } from './controllers/lessor.controller';
import { LessorRepository } from './repositories/lessor.repository';
import { LessorService } from './services/lessor.service';

import { AdminModule } from '@/modules/admin/admin.module';
import { PaymentModule } from '@/modules/payment/payment.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  controllers: [LessorController],
  imports: [UserModule, AdminModule, PaymentModule],
  exports: [LessorService],
  providers: [LessorService, LessorRepository],
})
export class LessorModule {}
