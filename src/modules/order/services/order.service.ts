import { Injectable } from '@nestjs/common';

import { OrderStatusType } from '@/constants';
import { FilterProductByOrderOptions } from '@/modules/order/domains/dtos/filterProductByOrder.dto';
import { OrderRepository } from '@/modules/order/repositories/order.repository';

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
