import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import {
  RegisterDto,
  SignInDto,
} from '@/modules/auth/domains/dtos/sign-in.dto';
import { AuthService } from '@/modules/auth/services/auth.service';
import { ContextProvider } from '@/providers';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async userSignIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Auth([ROLE.ADMIN, ROLE.USER, ROLE.LESSOR])
  @Get('profile')
  getProfile() {
    return ContextProvider.getAuthUser();
  }

  @Post('admin-login')
  @HttpCode(HttpStatus.OK)
  async adminSignIn(@Body() signInDto: SignInDto) {
    return this.authService.adminSignIn(signInDto);
  }

  @Post('register')
  async userRegister(@Body() registerDto: RegisterDto) {
    return this.authService.userRegister(registerDto);
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
