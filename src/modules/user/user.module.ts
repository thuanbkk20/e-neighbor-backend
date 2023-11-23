import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { AdminModule } from '@modules/admin/admin.module';
import { LessorService } from '../lessor/services/lessor.service';
import { LessorRepository } from '../lessor/repositories/lessor.repository';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [AdminModule, PaymentModule],
  exports: [UserService],
  providers: [UserService, UserRepository, LessorService, LessorRepository],
  controllers: [UserController],
})
export class UserModule {}
