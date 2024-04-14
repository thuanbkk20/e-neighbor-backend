import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { OrderStatusType } from '@/constants';
import { FilterProductByOrderOptions } from '@/modules/order/domains/dtos/filterProductByOrder.dto';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(OrderEntity, dataSource.createEntityManager());
  }

  async numberOfOrderByStatus(
    productId: number,
    status: OrderStatusType,
  ): Promise<number> {
    const query = this.createQueryBuilder('orders')
      .leftJoin('orders.product', 'product')
      .where('product.id = :id', { id: productId })
      .andWhere('orders.orderStatus = :status', { status: status });
    return query.getCount();
  }

  //Return list of product id that match filterOptions
  async filterProductByOrder(
    productId: number[],
    filterOptions: FilterProductByOrderOptions,
  ): Promise<number[]> {
    const query = this.createQueryBuilder('orders')
      .leftJoin('orders.product', 'product')
      .where('product.id IN (:...ids)', { ids: productId });

    if (filterOptions.status) {
      query.andWhere('orders.orderStatus = :status', {
        status: filterOptions.status,
      });
    }
    query
      .select('product.id')
      .addSelect('COUNT(orders.id)', 'orderCount')
      .groupBy('product.id');
    if (filterOptions.minRentalFrequency) {
      query.where('orderCount >= number', {
        number: filterOptions.minRentalFrequency,
      });
    }
    if (filterOptions.maxRentalFrequency) {
      query.where('orderCount <= number', {
        number: filterOptions.maxRentalFrequency,
      });
    }
    const products = await query.getRawMany();
    const ids = products.map((product) => product.product_id);
    return ids;
  }

  async getOrdersByStatuses(
    statuses: OrderStatusType[],
    productId?: number,
  ): Promise<OrderEntity[]> {
    const query = this.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.product', 'product')
      .leftJoinAndSelect('orders.rentalFees', 'rentalFees')
      .leftJoinAndSelect('orders.feedback', 'feedback')
      .leftJoinAndSelect('orders.payment', 'payment')
      .leftJoinAndSelect('orders.user', 'user')
      .where('orders.orderStatus IN (:...orderStatus)', {
        orderStatus: statuses,
      });
    if (productId) {
      query.andWhere('product.id = :id', { id: productId });
    }
    return query.getMany();
  }
}
