import { Controller } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}
