import { ROLE } from '@/constants';
import { Auth, Roles } from '@/decorators';
import { ContextProvider } from '@/providers';
import { UserService } from '@modules/user/services/user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  getInfo() {
    return ContextProvider.getAuthUser();
  }
}
