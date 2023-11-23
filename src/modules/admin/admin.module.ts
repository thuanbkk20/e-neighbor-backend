import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminRepository } from './repositories/admin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './domains/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  exports: [AdminService, AdminRepository],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
