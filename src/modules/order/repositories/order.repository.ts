import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from '../domains/entities/order.entity';
import { OrderStatusType } from '../../../constants';
import { FilterProductByOrderOptions } from '../domains/dtos/filterProductByOrder.dto';

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
}
