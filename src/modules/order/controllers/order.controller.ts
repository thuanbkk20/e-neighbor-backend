import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrderService } from '@/modules/order/services/order.service';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}
