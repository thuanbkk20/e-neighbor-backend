import { ROLE } from './../../../constants/role';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto, SignInDto } from '../domains/dtos/sign-in.dto';
import { ContextProvider } from './../../../providers/context.provider';
import { Auth } from './../../../decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async userSignIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
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
}
