import { Module } from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';

@Module({
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
