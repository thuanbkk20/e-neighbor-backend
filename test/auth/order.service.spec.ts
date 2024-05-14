import { OrderRecordDto } from '@/modules/order/domains/dtos/orderRecord.dto';
import { ORDER_LIST_SORT_FIELD } from './../../src/constants/order-list-sort-field';
import { LessorOnboardDto } from './../../src/modules/lessor/domains/dtos/lessor-onboard.dto';
import { LessorEntity } from './../../src/modules/lessor/domains/entities/lessor.entity';
import { PAYMENT_STATUS } from './../../src/constants/payment-status';
import { ProductRepository } from './../../src/modules/product/repositories/product.reposiory';
import { AbstractEntity } from '@/common/abstract.entity';
import { REQUIRED_DOCUMENTS } from './../../src/constants/required-documents';
import { MORTGAGE } from './../../src/constants/mortgage';
import { RENT_TIME } from './../../src/constants/rent-time';
import { TIME_UNIT } from './../../src/constants/time-unit';
import { OrderNotFoundException } from './../../src/exceptions/order-not-found.exception';
import { OrderDto } from './../../src/modules/order/domains/dtos/order.dto';
import { ORDER_STATUS } from './../../src/constants/order-status';
import { OrderEntity } from './../../src/modules/order/domains/entities/order.entity';
import { RentalFeeRepository } from './../../src/modules/order/repositories/rentalFee.repository';
import { ProductService } from './../../src/modules/product/services/product.service';
import { OrderRepository } from './../../src/modules/order/repositories/order.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../src/modules/order/services/order.service';
import { UserService } from '../../src/modules/user/services/user.service';
import { COMMON_LOCATION } from '../../src/constants/common-location';
import { ROLE } from '../../src/constants/role';
import { AbstractDto } from '../../src/common/dtos/abstract.dto';
import { STATUS } from '../../src/constants/status';
import * as dayjs from 'dayjs';
import { ContextProvider } from '../../src/providers/context.provider';
import e from 'express';
import { UserEntity } from '../../src/modules/user/domains/entities/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CategoryEntity } from '../../src/modules/category/domains/entities/category.entity';
import { ORDER } from '../../src/constants/order';
import { PageDto } from '../../src/common/dtos/page.dto';
describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository;
  const mockUser = {
    id: 1,
    createdAt: new Date('2024-05-11T01:44:05.468Z'),
    updatedAt: new Date('2024-05-11T01:44:05.468Z'),
    userName: 'user01',
    password: '$2b$10$jHTdlcFzSzRyDXfBhpvTPeZ6gNHHebRPEeQMVsbJKiW0VMdS/gzxy',
    email: 'user01@gmail.com',
    avatar:
      'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png',
    address: 'Ho Chi Minh',
    detailedAddress:
      '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
    dob: new Date('1998-07-27T23:00:00.000Z'),
    phoneNumber: '012345678',
    fullName: 'Nguyễn Minh Quang',
    role: ROLE.LESSOR,
    citizenId: '0123456789',
    citizenCardFront:
      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
    citizenCardBack:
      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
    wallet: 0,
    orders: [],
    toDto: () => new AbstractDto(mockUser),
  };
  const mockLessor = {
    id: 1,
    createdAt: new Date('2024-05-11T01:44:05.473Z'),
    updatedAt: new Date('2024-05-11T01:44:05.473Z'),
    description: 'Dịch vụ cung cấp các mặt hàng cho thuê uy tín, chuyên nghiệp',
    wareHouseAddress:
      '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
    responseRate: 0,
    responseTime: 0,
    agreementRate: 0,
    shopName: 'Dịch vụ cho thuê Minh Quang',
    location: COMMON_LOCATION.HCM,
    user: mockUser,
    products: [],
    toDto: () => new AbstractDto(mockLessor),
  };
  const mockRenter = {
    ...mockUser,
    id: 2,
  };
  const mockCarProduct = {
    accessCount: 0,
    id: 1,
    createdAt: new Date('2024-05-11T01:44:05.478Z'),
    updatedAt: new Date('2024-05-11T01:44:05.478Z'),
    name: 'Toyota Camry 2023',
    status: STATUS.AVAILABLE,
    mortgage: MORTGAGE.OPTION1,
    description:
      'Spacious and fuel-efficient sedan, perfect for comfortable rides in the city or on road trips.',
    value: 85000000,
    policies: [
      'No smoking inside the car',
      'Pets allowed with prior approval',
      'Mileage limit: 200 kilometers per day (additional charges apply)',
    ],
    images: [
      'https://www.koonstoyotatysonscorner.com/blogs/4498/wp-content/uploads/2022/11/2023-Toyota-Camry.webp',
      'https://banxemoi.com.vn/wp-content/uploads/2022/09/noi-that-xe-toyota-camry-2023-moi.jpg',
      'https://binhduong.toyota.com.vn/upload/anh_1_3.jpg',
    ],
    characteristics: [
      { localeId: 'vehicle-characteristics-seats', description: '5' },
      {
        localeId: 'vehicle-characteristics-fuel',
        description: 'Gasoline',
      },
      {
        localeId: 'vehicle-characteristics-weight',
        description: '1496 kg',
      },
      {
        localeId: 'vehicle-characteristics-utility-GPS',
        description: 'Included',
      },
      {
        localeId: 'vehicle-characteristics-utility-backCamera',
        description: 'Included',
      },
      {
        localeId: 'vehicle-characteristics-utility-airBag',
        description: 'Included',
      },
    ],
    price: 800000,
    requiredDocuments: REQUIRED_DOCUMENTS.OPTION1,
    timeUnit: TIME_UNIT.DAY,
    rejectReason: null,
    isConfirmed: true,
    rating: 0,
    category: {
      id: 8,
      createdAt: new Date('2024-05-11T01:44:05.478Z'),
      updatedAt: new Date('2024-05-11T01:44:05.478Z'),
      name: 'vehicle.category.car',
      isVehicle: true,
      characteristics: [
        'vehicle-characteristics-utility-bluetooth',
        'vehicle-characteristics-utility-obstacleSensor',
        'vehicle-characteristics-utility-usb',
        'vehicle-characteristics-utility-dashcam',
        'vehicle-characteristics-utility-speedChart',
        'vehicle-characteristics-utility-sparewheel',
        'vehicle-characteristics-utility-backCamera',
        'vehicle-characteristics-utility-sunRoof',
        'vehicle-characteristics-utility-etc',
        'vehicle-characteristics-utility-tyreSensor',
        'vehicle-characteristics-utility-airBag',
      ],
      products: [],
      toDto: () => new AbstractDto(new CategoryEntity()),
    },
    lessor: mockLessor,
    productSurcharges: [],
    orders: [],
    toDto: () => new AbstractDto(mockCarProduct),
  };
  const mockOrder = {
    id: 1,
    createdAt: new Date('2024-05-11T20:01:25.796Z'),
    updatedAt: new Date('2024-05-11T20:01:25.796Z'),
    rentTime: new Date('2024-05-12T20:01:25.796Z'),
    returnTime: new Date('2024-05-13T20:01:25.796Z'),
    realRentTime: null,
    realReturnTime: null,
    conditionUponReceipt: null,
    imagesUponReceipt: null,
    conditionUponReturn: null,
    imagesUponReturn: null,
    deliveryAddress: 'address',
    orderValue: 1000000,
    orderStatus: ORDER_STATUS.COMPLETED,
    paymentStatus: PAYMENT_STATUS.COMPLETE,
    rentPrice: 1000000,
    timeUnit: TIME_UNIT.DAY,
    rejectReason: null,
    product: mockCarProduct,
    rentalFees: [],
    feedback: null,
    payment: null,
    user: mockRenter,
    toDto: () => new AbstractDto(mockOrder),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            numberOfOrderByStatus: jest.fn().mockReturnValue(3),
            filterProductByOrder: jest.fn().mockReturnValue([1]),
            getOrdersByStatuses: jest.fn().mockReturnValue([mockOrder]),
            findOneById: jest.fn().mockImplementation((id: number) => {
              return id === 1 ? Promise.resolve(mockOrder) : null;
            }),
            save: jest.fn().mockReturnValue(mockOrder),
            getOrderList: jest.fn().mockReturnValue({
              entities: [mockOrder],
              itemCount: 1,
            }),
          },
        },
        {
          provide: UserService,
          useValue: {
            updateWallet: jest.fn().mockImplementation(() => {}),
          },
        },
        {
          provide: ProductService,
          useValue: {
            getEntityById: jest.fn().mockReturnValue(mockCarProduct),
          },
        },
        {
          provide: RentalFeeRepository,
          useValue: {
            findOneBy: jest.fn().mockReturnValue({}),
            save: jest.fn().mockImplementation((rentalFee) => rentalFee),
          },
        },
      ],
    }).compile();
    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('numberOfOrderByStatus', () => {
    it('should return number of order by status', async () => {
      const response = await orderService.numberOfOrderByStatus(
        1,
        ORDER_STATUS.COMPLETED,
      );
      expect(response).toEqual(3);
    });
  });

  describe('filterProductByOrder', () => {
    it('should return list of product ids based on filter options', async () => {
      const response = await orderService.filterProductByOrder([1, 2], {
        status: ORDER_STATUS.COMPLETED,
        minRentalFrequency: 1,
        maxRentalFrequency: 100,
      });
      expect(response).toEqual([1]);
    });
  });

  describe('getOrdersByStatuses', () => {
    it('should return list of orders based on status options', async () => {
      const response = await orderService.getOrdersByStatuses(
        [ORDER_STATUS.COMPLETED],
        1,
      );
      expect(response).toEqual([mockOrder]);
    });
  });

  describe('findOrderById', () => {
    it('should return orderDto if id is valid', async () => {
      const response = await orderService.findOrderById(1);
      expect(response).toBeInstanceOf(OrderDto);
      expect(response.id).toEqual(1);
    });
    it('should throw OrderNotFoundException if id is invalid', async () => {
      try {
        await orderService.findOrderById(1);
      } catch (error) {
        expect(error).toBeInstanceOf(OrderNotFoundException);
      }
    });
  });

  describe('findOrderEntityById', () => {
    it('should return orderEntity if id is valid', async () => {
      const response = await orderService.findOrderEntityById(1);
      expect(response.id).toEqual(1);
    });
  });

  describe('createOrder', () => {
    it('should return orderEntity if id is valid', async () => {
      const currentDate = dayjs();
      const createOrderDto = {
        productId: 1,
        rentTime: currentDate.add(1, 'day').toDate(),
        returnTime: currentDate.add(2, 'day').toDate(),
        deliveryAddress: 'address',
      };
      jest
        .spyOn(ContextProvider, 'getAuthUser')
        .mockReturnValue(mockRenter as UserEntity);
      const response = await orderService.createOrder(createOrderDto);
      expect(response).toBeInstanceOf(OrderDto);
      expect(response.id).toEqual(1);
    });
    it('should throw BadRequestException if lessor rent their own product', async () => {
      try {
        const currentDate = dayjs();
        const createOrderDto = {
          productId: 1,
          rentTime: currentDate.add(1, 'day').toDate(),
          returnTime: currentDate.add(2, 'day').toDate(),
          deliveryAddress: 'address',
        };
        jest
          .spyOn(ContextProvider, 'getAuthUser')
          .mockReturnValue(mockUser as UserEntity);
        await orderService.createOrder(createOrderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw BadRequestException if rentTime is invalid', async () => {
      try {
        const currentDate = dayjs();
        const createOrderDto = {
          productId: 1,
          rentTime: currentDate.subtract(1, 'day').toDate(),
          returnTime: currentDate.add(2, 'day').toDate(),
          deliveryAddress: 'address',
        };
        jest
          .spyOn(ContextProvider, 'getAuthUser')
          .mockReturnValue(mockRenter as UserEntity);
        await orderService.createOrder(createOrderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('calculateInitialOrderPrice', () => {
    it('should calculate initial order price for product with time unit is day', async () => {
      const mockProductWithDayUnit = {
        ...mockCarProduct,
        price: 800000,
        timeUnit: TIME_UNIT.DAY,
        orders: [],
      };
      const currentDate = dayjs();
      const rentDate = currentDate.add(1, 'day').toDate();
      const returnDate = currentDate.add(3, 'day').toDate();
      const response = await orderService.calculateInitialOrderPrice(
        rentDate,
        returnDate,
        mockProductWithDayUnit,
      );
      expect(response).toEqual(1600000);
    });
    it('should calculate initial order price for product with time unit is week', async () => {
      const mockProductWithDayUnit = {
        ...mockCarProduct,
        price: 700000,
        timeUnit: TIME_UNIT.WEEK,
        orders: [],
      };
      const currentDate = dayjs();
      const rentDate = currentDate.add(1, 'day').toDate();
      const returnDate = currentDate.add(10, 'day').toDate();
      const response = await orderService.calculateInitialOrderPrice(
        rentDate,
        returnDate,
        mockProductWithDayUnit,
      );
      expect(response).toEqual(900000);
    });
    it('should calculate initial order price for product with time unit is month', async () => {
      const mockProductWithDayUnit = {
        ...mockCarProduct,
        price: 2800000,
        timeUnit: TIME_UNIT.MONTH,
        orders: [],
      };
      const currentDate = dayjs();
      const rentDate = currentDate.add(1, 'day').toDate();
      const returnDate = currentDate.add(30, 'day').toDate();
      const response = await orderService.calculateInitialOrderPrice(
        rentDate,
        returnDate,
        mockProductWithDayUnit,
      );
      expect(response).toEqual(2900000);
    });
  });

  describe('userUpdatePendingOrder', () => {
    it('should update order status from pending to canceled if user cancel order', async () => {
      const mockUpdatePendingOrderDto = {
        orderId: 1,
        isCanceled: true,
      };
      const mockRenter = {
        ...mockUser,
        user: {
          id: 2,
        },
        id: 2,
      };
      jest
        .spyOn(orderRepository, 'findOneById')
        .mockReturnValue(
          Promise.resolve({ ...mockOrder, orderStatus: ORDER_STATUS.PENDING }),
        );
      jest
        .spyOn(ContextProvider, 'getAuthUser')
        .mockReturnValue(mockRenter as UserEntity);
      const response = await orderService.userUpdatePendingOrder(
        mockUpdatePendingOrderDto,
      );
      expect(response).toBeInstanceOf(OrderDto);
    });
    it('should throw UnauthorizedException if user try to update order belong to another user', async () => {
      try {
        const mockUpdatePendingOrderDto = {
          orderId: 1,
          isCanceled: true,
        };
        const mockRenter = {
          ...mockUser,
          user: {
            id: 1,
          },
          id: 1,
        };
        jest.spyOn(orderRepository, 'findOneById').mockReturnValue(
          Promise.resolve({
            ...mockOrder,
            orderStatus: ORDER_STATUS.PENDING,
          }),
        );
        jest
          .spyOn(ContextProvider, 'getAuthUser')
          .mockReturnValue(mockRenter as UserEntity);
        await orderService.userUpdatePendingOrder(mockUpdatePendingOrderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
    it('should throw BadRequestException if order is not in pending status', async () => {
      try {
        const mockUpdatePendingOrderDto = {
          orderId: 1,
          isCanceled: true,
        };
        const mockRenter = {
          ...mockUser,
          user: {
            id: 2,
          },
          id: 2,
        };
        jest.spyOn(orderRepository, 'findOneById').mockReturnValue(
          Promise.resolve({
            ...mockOrder,
            orderStatus: ORDER_STATUS.APPROVED,
          }),
        );
        jest
          .spyOn(ContextProvider, 'getAuthUser')
          .mockReturnValue(mockRenter as UserEntity);
        await orderService.userUpdatePendingOrder(mockUpdatePendingOrderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('lessorUpdatePendingOrder', () => {
    it('should update order status from pending to approve if lessor approve order', async () => {
      const mockUpdatePendingOrderDto = {
        orderId: 1,
        isRejected: false,
        rejectReason: '',
      };
      jest
        .spyOn(orderRepository, 'findOneById')
        .mockReturnValue(
          Promise.resolve({ ...mockOrder, orderStatus: ORDER_STATUS.PENDING }),
        );
      jest
        .spyOn(ContextProvider, 'getAuthUser')
        .mockReturnValue(mockLessor as LessorEntity);
      const response = await orderService.lessorUpdatePendingOrder(
        mockUpdatePendingOrderDto,
      );
      expect(response).toBeInstanceOf(OrderDto);
    });
    it('should update order status from pending to rejected if lessor reject order', async () => {
      const mockUpdatePendingOrderDto = {
        orderId: 1,
        isRejected: true,
        rejectReason: 'Product is unavailable',
      };
      jest
        .spyOn(orderRepository, 'findOneById')
        .mockReturnValue(
          Promise.resolve({ ...mockOrder, orderStatus: ORDER_STATUS.PENDING }),
        );
      jest
        .spyOn(ContextProvider, 'getAuthUser')
        .mockReturnValue(mockLessor as LessorEntity);
      const response = await orderService.lessorUpdatePendingOrder(
        mockUpdatePendingOrderDto,
      );
      expect(response).toBeInstanceOf(OrderDto);
    });
    it('should throw UnauthorizedException if user try to update order belong to another user', async () => {
      try {
        const mockUpdatePendingOrderDto = {
          orderId: 1,
          isRejected: false,
          rejectReason: '',
        };
        jest.spyOn(orderRepository, 'findOneById').mockReturnValue(
          Promise.resolve({
            ...mockOrder,
            orderStatus: ORDER_STATUS.PENDING,
          }),
        );
        jest
          .spyOn(ContextProvider, 'getAuthUser')
          .mockReturnValue({ ...mockLessor, id: 2 } as LessorEntity);
        await orderService.lessorUpdatePendingOrder(mockUpdatePendingOrderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
    it('should throw BadRequestException if order is not in pending status', async () => {
      try {
        const mockUpdatePendingOrderDto = {
          orderId: 1,
          isRejected: false,
          rejectReason: '',
        };
        jest.spyOn(orderRepository, 'findOneById').mockReturnValue(
          Promise.resolve({
            ...mockOrder,
            orderStatus: ORDER_STATUS.APPROVED,
          }),
        );
        jest
          .spyOn(ContextProvider, 'getAuthUser')
          .mockReturnValue({ ...mockLessor, id: 1 } as LessorEntity);
        await orderService.lessorUpdatePendingOrder(mockUpdatePendingOrderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('getOrdersList', () => {
    it('should return orders list based on options', async () => {
      const mockPageOptions = {
        sortField: ORDER_LIST_SORT_FIELD.ORDER_VALUE,
        order: ORDER.DESC,
        page: 1,
        take: 10,
        skip: 0,
        productId: 1,
      };
      const response = await orderService.getOrdersList(mockPageOptions);
      expect(response).toBeInstanceOf(PageDto<OrderRecordDto>);
    });
  });
});
