import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  exports: [UserService],
  providers: [UserService, UserRepository],
})
export class UserModule {}
