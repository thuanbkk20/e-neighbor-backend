import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { UserService } from '@modules/user/services/user.service';
import { Body, Controller, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from '../domains/dtos/user-update.dto';
import { UserDto } from '../domains/dtos/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Auth([ROLE.ADMIN, ROLE.USER, ROLE.LESSOR])
  @Patch('/update')
  async updateUser(@Body() user: UserUpdateDto): Promise<UserDto> {
    return this.userService.updateUser(user);
  }
}
