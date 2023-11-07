import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { LessorModule } from '../lessor/lessor.module';
import { GoogleStrategy } from './strategies/google.stategy';

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
