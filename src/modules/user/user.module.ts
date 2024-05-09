import { Module, forwardRef } from '@nestjs/common';

import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

import { AdminModule } from '@/modules/admin/admin.module';
import { LessorModule } from '@/modules/lessor/lessor.module';
import { PaymentModule } from '@/modules/payment/payment.module';

@Module({
  imports: [AdminModule, PaymentModule, forwardRef(() => LessorModule)],
  exports: [UserService],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
