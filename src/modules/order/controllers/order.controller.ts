import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '@/common/dtos/page.dto';
import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { CreateOrderDto } from '@/modules/order/domains/dtos/createOrder.dto';
import { LessorUpdatePendingOrderDto } from '@/modules/order/domains/dtos/lessorUpdatePendingOrder.dto';
import { OrderDto } from '@/modules/order/domains/dtos/order.dto';
import { OrderListOkResponse } from '@/modules/order/domains/dtos/orderListOkResponse.dto';
import { OrderPageOptionsDto } from '@/modules/order/domains/dtos/orderPageOptions.dto';
import { OrderRecordDto } from '@/modules/order/domains/dtos/orderRecord.dto';
import { UpdateApprovedOrderDto } from '@/modules/order/domains/dtos/updateApprovedOrder.dto';
import { UserUpdatePendingOrderDto } from '@/modules/order/domains/dtos/userUpdatePendingOrder.dto';
import { OrderService } from '@/modules/order/services/order.service';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth([ROLE.USER, ROLE.LESSOR])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: OrderDto })
  @ApiBody({ type: CreateOrderDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Auth([ROLE.ADMIN, ROLE.LESSOR, ROLE.USER])
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: OrderListOkResponse,
  })
  async getOrdersList(
    @Query() orderPageOptions: OrderPageOptionsDto,
  ): Promise<PageDto<OrderRecordDto>> {
    return this.orderService.getOrdersList(orderPageOptions);
  }

  // May need to be disabled because the transaction is created at the moment the user places order
  @Auth([ROLE.USER, ROLE.LESSOR])
  @Patch('pending/user-update')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBody({
    type: UserUpdatePendingOrderDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async userUpdatePendingOrder(
    @Body()
    updateDto: UserUpdatePendingOrderDto,
  ) {
    return this.orderService.userUpdatePendingOrder(updateDto);
  }

  // As the transaction is created at the moment the user places order, a refund is required if lessor reject the order
  @Auth([ROLE.LESSOR])
  @Patch('pending/lessor-update')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBody({
    type: LessorUpdatePendingOrderDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async lessorUpdatePendingOrder(
    @Body()
    updateOptions: LessorUpdatePendingOrderDto,
  ) {
    return this.orderService.lessorUpdatePendingOrder(updateOptions);
  }

  @Auth([ROLE.USER, ROLE.LESSOR])
  @Patch('approved/user-update')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBody({
    type: UpdateApprovedOrderDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async userUpdateApprovedOrder(
    @Body()
    updateDto: UpdateApprovedOrderDto,
  ) {
    return this.orderService.updateApprovedOrder(updateDto);
  }

  @Auth([ROLE.ADMIN, ROLE.USER, ROLE.LESSOR])
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: OrderDto,
  })
  async findOrderById(@Param('id') id: number): Promise<OrderDto> {
    return this.orderService.findOrderById(id);
  }
}
