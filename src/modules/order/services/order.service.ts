import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';

import { ORDER_STATUS, OrderStatusType, RENT_TIME } from '@/constants';
import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';
import { CreateOrderDto } from '@/modules/order/domains/dtos/createOrder.dto';
import { FilterProductByOrderOptions } from '@/modules/order/domains/dtos/filterProductByOrder.dto';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';
import { ProductService } from '@/modules/product/services/product.service';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';
import { ContextProvider } from '@/providers';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  async numberOfOrderByStatus(
    productId: number,
    status: OrderStatusType,
  ): Promise<number> {
    return this.orderRepository.numberOfOrderByStatus(productId, status);
  }

  //Return list of product id that match filterOptions
  async filterProductByOrder(
    productIds: number[],
    filterOptions: FilterProductByOrderOptions,
  ): Promise<number[]> {
    return this.orderRepository.filterProductByOrder(productIds, filterOptions);
  }

  async getOrdersByStatuses(
    statuses: OrderStatusType[],
    productId?: number,
  ): Promise<OrderEntity[]> {
    return this.orderRepository.getOrdersByStatuses(statuses, productId);
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    let user = ContextProvider.getAuthUser();
    const rentTime = createOrderDto.rentTime;
    const returnTime = createOrderDto.returnTime;
    const product = await this.productService.getEntityById(
      createOrderDto.productId,
    );
    //Check user
    if (user instanceof LessorEntity) {
      if (user.id === product.lessor.id) {
        throw new BadRequestException('Lessor can not rent their own product!');
      }
      user = user.user; // Change from LessorEntity to UserEntity
    }
    //Check time
    this.checkRentTime(rentTime, returnTime, product);
    //Retrieve all product orders that are either approved or in progress
    const orders = await this.getOrdersByStatuses(
      [ORDER_STATUS.APPROVED, ORDER_STATUS.IN_PROGRESS],
      createOrderDto.productId,
    );
    // Need to check approved or in progress order in time range
    const order = new OrderEntity();
    order.rentTime = rentTime;
    order.returnTime = returnTime;
    order.deliveryAddress = createOrderDto.deliveryAddress;
    order.product = product;
    order.rentPrice = product.price;
    order.orderValue = this.calculateInitOrderPrice(
      rentTime,
      returnTime,
      product,
    );
    if (user instanceof UserEntity) {
      order.user = user;
    }
    try {
      await this.orderRepository.save(order);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new InternalServerErrorException('Failed to create order');
    }
    return order;
  }

  private checkRentTime(
    rentDate: Date,
    returnDate: Date,
    product: ProductEntity,
  ): boolean {
    const currentDate = new Date();
    if (typeof rentDate === 'string') {
      rentDate = new Date(rentDate);
    }
    if (typeof returnDate === 'string') {
      returnDate = new Date(returnDate);
    }
    if (rentDate.getTime() < currentDate.getTime()) {
      throw new BadRequestException('Rent time cannot be in the past!');
    }
    const checkTimeFlag = this.checkRentTimeByTimeUnit(
      rentDate,
      returnDate,
      product.timeUnit,
    );
    if (!checkTimeFlag) {
      throw new BadRequestException(
        'Return date must be after rent date at least 1 ' + product.timeUnit,
      );
    }
    const rentHour = rentDate.getUTCHours();
    const returnHour = returnDate.getUTCHours();
    if (
      rentHour < RENT_TIME.RENT_START ||
      rentHour > RENT_TIME.RENT_END ||
      returnHour < RENT_TIME.RETURN_START ||
      returnHour > RENT_TIME.RETURN_END
    ) {
      throw new BadRequestException(
        `Rent time must be between ${RENT_TIME.RENT_START} and ${RENT_TIME.RENT_END}; return time must be between ${RENT_TIME.RETURN_START} and ${RENT_TIME.RETURN_END}!`,
      );
    }
    return true;
  }

  //will be implemented later
  private calculateInitOrderPrice(
    rentDate: Date,
    returnDate: Date,
    product: ProductEntity,
  ): number {
    return 0;
  }

  /**
   * Checks if the second date is after the first date by at least 1 time unit, considering the time component for day comparisons.
   * For week and month comparisons, it uses approximations for simplicity.
   *
   * @param {Date} date1Obj - The first date to compare.
   * @param {Date} date2Obj - The second date to compare.
   * @param {TimeUnitType} timeUnit - The time unit to compare by (day, week, or month).
   * @returns {boolean} - Returns true if date2 is after date1 by at least 1 time unit, or if they are on the same day for day comparisons.
   * @throws {Error} - Throws an error if an invalid time unit is provided.
   */
  private checkRentTimeByTimeUnit(
    date1Obj: Date,
    date2Obj: Date,
    timeUnit: TimeUnitType,
  ): boolean {
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = date2Obj.getTime() - date1Obj.getTime();

    // Calculate the difference based on the specified time unit
    let differenceInTimeUnits: number;
    switch (timeUnit) {
      case TIME_UNIT.DAY:
        // Convert milliseconds to days, considering the time component
        differenceInTimeUnits =
          differenceInMilliseconds / (1000 * 60 * 60 * 24);
        break;
      case TIME_UNIT.WEEK:
        differenceInTimeUnits =
          differenceInMilliseconds / (1000 * 60 * 60 * 24 * (7 - 1));
        break;
      case TIME_UNIT.MONTH:
        // Assuming that a month is 4 week
        differenceInTimeUnits =
          differenceInMilliseconds / (1000 * 60 * 60 * 24 * (28 - 1));
        break;
      default:
        throw new Error('Invalid time unit');
    }

    // Check if the difference is at least 1 time unit
    return (
      differenceInTimeUnits >= 1 ||
      (differenceInTimeUnits >= 0 && timeUnit === TIME_UNIT.DAY)
    );
  }
}
