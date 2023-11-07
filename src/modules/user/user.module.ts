import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { AdminService } from '@modules/admin/services/admin.service';
import { AdminModule } from '@modules/admin/admin.module';
import { LessorModule } from '@modules/lessor/lessor.module';

@Module({
  imports: [AdminModule, LessorModule],
  exports: [UserService],
  providers: [UserService, UserRepository, AdminService],
  controllers: [UserController],
})
export class UserModule {}
