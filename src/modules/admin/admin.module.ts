import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminRepository } from './repositories/admin.repository';

@Module({
  exports: [AdminService],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
