import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';

@Module({
  exports: [UserService],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
