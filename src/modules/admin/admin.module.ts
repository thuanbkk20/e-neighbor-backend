import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminEntity } from './domains/entities/admin.entity';
import { AdminRepository } from './repositories/admin.repository';
import { AdminService } from './services/admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  exports: [AdminService, AdminRepository],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
