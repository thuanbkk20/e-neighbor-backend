import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { OrderStatusType } from '@/constants';
import { FilterProductByOrderOptions } from '@/modules/order/domains/dtos/filterProductByOrder.dto';
import { OrderPageOptionsDto } from '@/modules/order/domains/dtos/orderPageOptions.dto';
import { OrderResponseDto } from '@/modules/order/domains/dtos/orderResponse.dto';
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

  async findOneById(id: number): Promise<OrderEntity> {
    const query = this.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.product', 'product')
      .leftJoinAndSelect('orders.rentalFees', 'rentalFees')
      .leftJoinAndSelect('orders.feedback', 'feedback')
      .leftJoinAndSelect('orders.payment', 'payment')
      .leftJoinAndSelect('orders.user', 'user')
      .where('orders.id = :id', {
        id: id,
      });
    return query.getOne();
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

  async getOrderList(
    pageOptionsDto: OrderPageOptionsDto,
  ): Promise<OrderResponseDto> {
    const queryBuilder = this.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.product', 'product')
      .leftJoinAndSelect('orders.rentalFees', 'rentalFees')
      .leftJoinAndSelect('orders.feedback', 'feedback')
      .leftJoinAndSelect('orders.payment', 'payment')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('product.lessor', 'lessor');
    // Handle filter
    if (pageOptionsDto.userId) {
      queryBuilder.andWhere('user.id = :userId', {
        userId: pageOptionsDto.userId,
      });
    }
    if (pageOptionsDto.lessorId) {
      queryBuilder.andWhere('lessor.id = :lessorId', {
        lessorId: pageOptionsDto.lessorId,
      });
    }
    if (pageOptionsDto.productId) {
      queryBuilder.andWhere('product.id = :productId', {
        productId: pageOptionsDto.productId,
      });
    }
    if (pageOptionsDto.productName) {
      const productName = pageOptionsDto.productName.toLowerCase();
      queryBuilder.andWhere('LOWER(product.name) LIKE :productName', {
        productName: `%${productName}%`,
      });
    }
    if (pageOptionsDto.orderStatus) {
      queryBuilder.andWhere('orders.orderStatus = :orderStatus', {
        orderStatus: pageOptionsDto.orderStatus,
      });
    }
    if (pageOptionsDto.paymentStatus) {
      queryBuilder.andWhere('orders.paymentStatus = :paymentStatus', {
        paymentStatus: pageOptionsDto.paymentStatus,
      });
    }
    if (pageOptionsDto.maxValue) {
      queryBuilder.andWhere('orders.orderValue <= :maxValue', {
        maxValue: pageOptionsDto.maxValue,
      });
    }
    if (pageOptionsDto.minValue) {
      queryBuilder.andWhere('orders.orderValue >= :minValue', {
        minValue: pageOptionsDto.minValue,
      });
    }

    // Handle sort
    if (pageOptionsDto.sortField) {
      queryBuilder
        .orderBy('orders.' + pageOptionsDto.sortField, pageOptionsDto.order)
        .addOrderBy('orders.id', 'DESC');
    } else {
      queryBuilder.orderBy('orders.id', 'DESC');
    }

    const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    // Handle paging
    queryBuilder.skip(skip).take(pageOptionsDto.take);

    // Retrieve entities
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    return new OrderResponseDto(entities, itemCount);
  }
}
