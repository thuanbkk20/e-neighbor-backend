import { Module } from '@nestjs/common';

import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

import { AdminModule } from '@/modules/admin/admin.module';
import { LessorRepository } from '@/modules/lessor/repositories/lessor.repository';
import { LessorService } from '@/modules/lessor/services/lessor.service';
import { PaymentModule } from '@/modules/payment/payment.module';

@Module({
  imports: [AdminModule, PaymentModule],
  exports: [UserService],
  providers: [UserService, UserRepository, LessorService, LessorRepository],
  controllers: [UserController],
})
export class UserModule {}
