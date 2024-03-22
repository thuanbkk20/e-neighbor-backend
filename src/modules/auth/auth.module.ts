import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleStrategy } from './strategies/google.stategy';

import { AdminModule } from '@/modules/admin/admin.module';
import { LessorModule } from '@/modules/lessor/lessor.module';
import { UserModule } from '@/modules/user/user.module';

config();
const configService = new ConfigService();

@Module({
  imports: [
    UserModule,
    AdminModule,
    LessorModule,
    JwtModule.register({
      global: true,
      secret: configService.get('ACCESS_TOKEN_PRIVATE_KEY'),
      signOptions: {
        expiresIn: configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    }),
  ],
  exports: [AuthService],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
