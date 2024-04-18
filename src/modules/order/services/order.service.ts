import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';

import {
  ORDER_STATUS,
  OrderStatusType,
  RENTAL_FEE_NAME,
  RENT_TIME,
} from '@/constants';
import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';
import { OrderNotFoundException } from '@/exceptions';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';
import { CreateOrderDto } from '@/modules/order/domains/dtos/createOrder.dto';
import { FilterProductByOrderOptions } from '@/modules/order/domains/dtos/filterProductByOrder.dto';
import { LessorUpdatePendingOrderDto } from '@/modules/order/domains/dtos/lessorUpdatePendingOrder.dto';
import { OrderDto } from '@/modules/order/domains/dtos/order.dto';
import { UserUpdatePendingOrderDto } from '@/modules/order/domains/dtos/userUpdatePendingOrder.dto';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { RentalFeeEntity } from '@/modules/order/domains/entities/rental-fee.entity';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { RentalFeeRepository } from '@/modules/order/repositories/rentalFee.repository';
import { ProductDto } from '@/modules/product/domains/dtos/product.dto';
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
    private readonly rentalFeeRepository: RentalFeeRepository,
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

  async findOrderById(id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOneById(id);
    if (!order) {
      throw new OrderNotFoundException(`Order with id ${id} not found!`);
    }
    const productCompletedOrder = await this.numberOfOrderByStatus(
      order.product.id,
      ORDER_STATUS.COMPLETED,
    );
    const product = await this.productService.getEntityById(order.product.id);
    const productDto = new ProductDto(product, productCompletedOrder);
    return new OrderDto(order, productDto);
  }

  async findOrderEntityById(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOneById(id);
    if (!order) {
      throw new OrderNotFoundException(`Can not found order with id ${id}`);
    }
    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderDto> {
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
    // Check time
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
      //Check if user complete profile information
      this.checkIfUserCompleteProfileInformation(user);
      order.user = user;
    }
    try {
      // Create rental fee
      const rentalFee = new RentalFeeEntity();
      rentalFee.name = RENTAL_FEE_NAME.STANDARD;
      rentalFee.description = `Fee for renting product with price ${product.price}, time unit ${product.timeUnit} from ${order.rentTime} to ${order.returnTime}`;
      rentalFee.amount = order.orderValue;
      rentalFee.order = order;
      await this.rentalFeeRepository.save(rentalFee);
      order.rentalFees = [rentalFee];
      //Save order
      const createdOrder = await this.orderRepository.save(order);
      const productDto = new ProductDto(product, 0);
      return new OrderDto(createdOrder, productDto);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  /**
   * Updates a pending order based on the provided updateDto.
   * If the order is not in pending status or the user does not have permission to update the order,
   * appropriate exceptions are thrown.
   * If the updateDto indicates cancellation, the order status is set to CANCELED;
   * otherwise, the order details are updated based on the provided rentTime, returnTime,
   * deliveryAddress, and other fields.
   * Returns the updated OrderDto.
   *
   * @param updateDto The DTO containing the update information.
   * @returns A Promise resolving to the updated OrderDto.
   * @throws BadRequestException if the order is not in pending status.
   * @throws UnauthorizedException if the user does not have permission to update the order.
   */
  async userUpdatePendingOrder(
    updateDto: UserUpdatePendingOrderDto,
  ): Promise<OrderDto> {
    const order = await this.findOrderEntityById(updateDto.orderId);
    const user = ContextProvider.getAuthUser();
    if (user.id !== order.user.id) {
      throw new UnauthorizedException(
        'PermissionDenied: Can not update order that belong to other user!',
      );
    }
    if (order.orderStatus !== ORDER_STATUS.PENDING) {
      //throw error
      throw new BadRequestException(`Order is not in pending status!`);
    }
    const product = await this.productService.getEntityById(order.product.id);
    if (updateDto.isCanceled === true) {
      order.orderStatus = ORDER_STATUS.CANCELED;
      const updatedOrder = await this.orderRepository.save(order);
      const productDto = new ProductDto(product, 0);
      return new OrderDto(updatedOrder, productDto);
    } else {
      let rentTime = updateDto.rentTime ? updateDto.rentTime : order.rentTime;
      let returnTime = updateDto.returnTime
        ? updateDto.returnTime
        : order.returnTime;
      if (typeof rentTime === 'string') {
        rentTime = new Date(rentTime);
      }
      if (typeof returnTime === 'string') {
        returnTime = new Date(returnTime);
      }
      // Check time
      this.checkRentTime(rentTime, returnTime, product);
      await this.validateRentTimeWithOrders(rentTime, returnTime, product);
      // Update order fields
      order.rentTime = rentTime;
      order.returnTime = returnTime;
      order.deliveryAddress = updateDto.deliveryAddress
        ? updateDto.deliveryAddress
        : order.deliveryAddress;
      order.rentPrice = product.price;
      order.orderValue = this.calculateInitialOrderPrice(
        rentTime,
        returnTime,
        product,
      );
      // Update standard rental fee
      const standardRentalFee = await this.rentalFeeRepository.findOneBy({
        id: order.rentalFees[0].id,
      });
      standardRentalFee.amount = order.orderValue;
      standardRentalFee.description = `Fee for renting product with price ${product.price}, time unit ${product.timeUnit} from ${order.rentTime} to ${order.returnTime}`;
      await this.rentalFeeRepository.save(standardRentalFee);
      //Save order
      const updatedOrder = await this.orderRepository.save(order);
      const productDto = new ProductDto(product, 0);
      return new OrderDto(updatedOrder, productDto);
    }
  }

  /**
   * Updates a pending order based on the provided updateDto.
   * If the order is not in pending status or the user does not have permission to update the order,
   * appropriate exceptions are thrown.
   * If the updateDto indicates rejection, the order status is set to REJECTED with the specified rejectReason;
   * otherwise, the order status is set to APPROVED.
   * Returns the updated OrderDto.
   *
   * @param updateDto The DTO containing the update information.
   * @returns A Promise resolving to the updated OrderDto.
   * @throws BadRequestException if the order is not in pending status.
   * @throws UnauthorizedException if the user does not have permission to update the order.
   */
  async lessorUpdatePendingOrder(
    updateDto: LessorUpdatePendingOrderDto,
  ): Promise<OrderDto> {
    const order = await this.findOrderEntityById(updateDto.orderId);
    const user = ContextProvider.getAuthUser();
    if (user.id !== order.product?.lessor?.id) {
      throw new UnauthorizedException(
        'PermissionDenied: Can not update order that belong to other lessor!',
      );
    }
    if (order.orderStatus !== ORDER_STATUS.PENDING) {
      //throw error
      throw new BadRequestException(`Order is not in pending status!`);
    }
    const product = await this.productService.getEntityById(order.product.id);
    if (updateDto.isRejected === true) {
      // reject the order
      order.orderStatus = ORDER_STATUS.REJECTED;
      order.rejectReason = updateDto.rejectReason;
    } else {
      // approve the order
      order.orderStatus = ORDER_STATUS.APPROVED;
    }
    const updatedOrder = await this.orderRepository.save(order);
    const productDto = new ProductDto(product, 0);
    return new OrderDto(updatedOrder, productDto);
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

  /**
   * Calculates the initial order price based on the rental dates and the product's pricing unit.
   *
   * @param rentDate The date when the product is rented.
   * @param returnDate The date when the product is returned.
   * @param product The product entity containing pricing information.
   * @returns The calculated initial order price.
   */
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
    //Retrieve all product orders that are either approved or in progress
    const orders = await this.getOrdersByStatuses(
      [ORDER_STATUS.APPROVED, ORDER_STATUS.IN_PROGRESS],
      product.id,
    );

    for (const order of orders) {
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

  private checkIfUserCompleteProfileInformation(user: UserEntity): boolean {
    // Check if any of the required fields are null or undefined
    const isAllRequiredFieldsAvailable =
      user.address &&
      user.detailedAddress &&
      user.dob &&
      user.phoneNumber &&
      user.fullName &&
      user.citizenId &&
      user.citizenCardFront &&
      user.citizenCardBack;

    if (!isAllRequiredFieldsAvailable) {
      throw new BadRequestException(
        'User must complete profile information before renting a product!',
      );
    }
    return true;
  }
}
