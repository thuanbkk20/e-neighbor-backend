import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { OrderStatusType } from '../../../constants';
import { FilterProductByOrderOptions } from '../domains/dtos/filterProductByOrder.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async numberOfOrderByStatus(
    productId: number,
    status: OrderStatusType,
  ): Promise<number> {
    return this.orderRepository.numberOfOrderByStatus(productId, status);
  }

  async filterProductByOrder(
    productIds: number[],
    filterOptions: FilterProductByOrderOptions,
  ): Promise<number[]> {
    return this.orderRepository.filterProductByOrder(productIds, filterOptions);
  }
}
