import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { CreateOrderDto } from '@/modules/order/domains/dtos/createOrder.dto';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { OrderService } from '@/modules/order/services/order.service';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth([ROLE.USER, ROLE.LESSOR])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: OrderEntity })
  @ApiBody({ type: CreateOrderDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderEntity> {
    return this.orderService.createOrder(createOrderDto);
  }
}
