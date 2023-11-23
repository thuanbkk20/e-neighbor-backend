import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { UserService } from '@modules/user/services/user.service';
import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from '../domains/dtos/user-update.dto';
import { UserDto } from '../domains/dtos/user.dto';
import { PaymentMethodEntity } from '../../payment/domains/entities/payment.entity';
import {
  AddPaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../../payment/domains/dtos/payment-method.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Auth([ROLE.ADMIN, ROLE.USER, ROLE.LESSOR])
  @Patch('/update')
  async updateUser(@Body() user: UserUpdateDto): Promise<UserDto> {
    return this.userService.updateUser(user);
  }

  @Auth([ROLE.ADMIN, ROLE.USER, ROLE.LESSOR])
  @Get('/:id/payment-method')
  async getPaymentMethods(
    @Param('id') id: number,
  ): Promise<PaymentMethodEntity[]> {
    return this.userService.getUserPaymentInfo(id);
  }

  @Auth([ROLE.ADMIN, ROLE.USER, ROLE.LESSOR])
  @Post('/:id/payment-method')
  async addPaymentMethods(@Body() paymentMethod: AddPaymentMethodDto) {
    return this.userService.addPaymentMethod(paymentMethod);
  }

  @Auth([ROLE.ADMIN, ROLE.USER, ROLE.LESSOR])
  @Put('/:id/payment-method')
  @ApiBody({ type: [UpdatePaymentMethodDto] })
  async updatePaymentMethods(
    @Param('id') id: number,
    @Body() paymentMethod: UpdatePaymentMethodDto[],
  ) {
    return this.userService.updatePaymentMethod(id, paymentMethod);
  }
}
