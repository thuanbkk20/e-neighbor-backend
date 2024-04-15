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
    let rentTime = createOrderDto.rentTime;
    let returnTime = createOrderDto.returnTime;
    if (typeof rentTime === 'string') {
      rentTime = new Date(rentTime);
    }
    if (typeof returnTime === 'string') {
      returnTime = new Date(returnTime);
    }
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
    await this.validateRentTimeWithOrders(rentTime, returnTime, product);
    //Create new order
    const order = new OrderEntity();
    order.rentTime = rentTime;
    order.returnTime = returnTime;
    order.deliveryAddress = createOrderDto.deliveryAddress;
    order.product = product;
    order.rentPrice = product.price;
    order.orderValue = this.calculateInitialOrderPrice(
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
    let rentHour = rentDate.getHours();
    if (
      rentDate.getMinutes() !== 0 ||
      rentDate.getSeconds() !== 0 ||
      rentDate.getMilliseconds() !== 0
    ) {
      rentHour += 1;
    }
    let returnHour = returnDate.getHours();
    if (
      returnDate.getMinutes() !== 0 ||
      returnDate.getSeconds() !== 0 ||
      returnDate.getMilliseconds() !== 0
    ) {
      returnHour += 1;
    }
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
  private calculateInitialOrderPrice(
    rentDate: Date,
    returnDate: Date,
    product: ProductEntity,
  ): number {
    let orderValue = 0;
    const rentTime = rentDate.getTime();
    const returnTime = returnDate.getTime();
    const differenceInMilliseconds = returnTime - rentTime;
    const differenceInDate = differenceInMilliseconds / (24 * 60 * 60 * 1000);
    switch (product.timeUnit) {
      case TIME_UNIT.DAY:
        // Convert milliseconds to days, considering the time component
        orderValue = product.price * Math.ceil(differenceInDate);
        break;
      case TIME_UNIT.WEEK:
        orderValue = (product.price / 7) * Math.ceil(differenceInDate);
        break;
      case TIME_UNIT.MONTH:
        orderValue = (product.price / 28) * Math.ceil(differenceInDate);
        break;
      default:
        throw new Error('Invalid time unit');
    }
    return orderValue;
  }

  /**
   * Validates the rental time range for a product, ensuring it does not overlap with existing orders.
   * Throws an error if the rental time range overlaps with existing orders or violates conditions.
   * @param rentTime The start time of the rental period.
   * @param returnTime The end time of the rental period.
   * @param product The product entity for which the rental time is being validated.
   * @throws BadRequestException If the rental time range overlaps with existing orders or violates conditions.
   */
  private async validateRentTimeWithOrders(
    rentTime: Date,
    returnTime: Date,
    product: ProductEntity,
  ): Promise<boolean> {
    const user = await ContextProvider.getAuthUser();
    //Retrieve all product orders that are either approved or in progress
    const orders = await this.getOrdersByStatuses(
      [ORDER_STATUS.APPROVED, ORDER_STATUS.IN_PROGRESS],
      product.id,
    );

    for (const order of orders) {
      if (order.user.id === user.id) {
        throw new BadRequestException(
          `User with id ${user.id} have ordered product with ${product.id} from ${order.rentTime} to ${order.returnTime}`,
        );
      }
      const orderRentTime = new Date(order.rentTime);
      const orderReturnTime = new Date(order.returnTime);
      orderRentTime.setDate(orderRentTime.getDate());
      orderRentTime.setHours(0, 0, 0, 0);
      orderReturnTime.setDate(orderReturnTime.getDate() + 1);
      orderReturnTime.setHours(0, 0, 0, 0);
      // Check if the given rentTime and returnTime satisfy the conditions
      if (rentTime >= orderReturnTime || returnTime <= orderRentTime) {
        return true; // No overlap, satisfies conditions
      } else {
        throw new BadRequestException(
          `The requested rental time overlaps with existing orders`,
        );
      }
    }
    return true;
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
    const differenceInDate = Math.ceil(
      differenceInMilliseconds / (24 * 60 * 60 * 1000),
    );
    switch (timeUnit) {
      case TIME_UNIT.DAY:
        // Convert milliseconds to days, considering the time component
        return differenceInDate >= 1;
      case TIME_UNIT.WEEK:
        return differenceInDate >= 7;
      case TIME_UNIT.MONTH:
        // Assuming that a month is 4 week
        return differenceInDate >= 28;
      default:
        throw new Error('Invalid time unit');
    }
    return true;
  }
}
