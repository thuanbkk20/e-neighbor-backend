import { PageDto } from '@/common/dtos/page.dto';
import { ORDER } from '@/constants';
import { FEEDBACK_LIST_SORT_FIELD } from './../../src/constants/feedback-list-sort-field';
import { FeedbackDto } from '@/modules/feedback/domains/dtos/feedback.dto';
import { UserEntity } from './../../src/modules/user/domains/entities/user.entity';
import { ProductService } from '@/modules/product/services/product.service';
import { OrderService } from './../../src/modules/order/services/order.service';
import { FeedbackRepository } from './../../src/modules/feedback/repositories/feedback.repository';
import { FeedbackService } from './../../src/modules/feedback/services/feedback.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ROLE } from '../../src/constants/role';
import { AbstractDto } from '../../src/common/dtos/abstract.dto';
import { COMMON_LOCATION } from '../../src/constants/common-location';
import { STATUS } from '../../src/constants/status';
import { MORTGAGE } from '../../src/constants/mortgage';
import { REQUIRED_DOCUMENTS } from '../../src/constants/required-documents';
import { TIME_UNIT } from '../../src/constants/time-unit';
import { CategoryEntity } from '../../src/modules/category/domains/entities/category.entity';
import { ORDER_STATUS } from '../../src/constants/order-status';
import { PAYMENT_STATUS } from '../../src/constants/payment-status';
import { ContextProvider } from '../../src/providers/context.provider';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
describe('FeedbackService', () => {
  let feedbackService: FeedbackService;
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
  const mockFeedback = {
    id: 1,
    createdAt: new Date('2024-05-13T20:03:14.571Z'),
    updatedAt: new Date('2024-05-13T20:03:14.571Z'),
    content: 'Good experience',
    image: 'image',
    star: 5,
    order: mockOrder,
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: FeedbackRepository,
          useValue: {
            productAverageStar: jest
              .fn()
              .mockImplementation((productId: number) => {
                return productId === 1 ? 4.5 : 0;
              }),
            productFeedbackSummary: jest.fn().mockReturnValue([
              {
                rating: 4,
                count: '2',
              },
              {
                rating: 5,
                count: '2',
              },
            ]),
            findByOrderId: jest.fn().mockImplementation((id: number) => {
              if (id === 1) return Promise.resolve(mockFeedback);
              return null;
            }),
            save: jest.fn().mockReturnValue(mockFeedback),
            getFeedbackList: jest.fn().mockReturnValue({
              entities: [mockFeedback],
              itemCount: 1,
            }),
          },
        },
        {
          provide: OrderService,
          useValue: {
            findOrderEntityById: jest.fn().mockReturnValue(mockOrder),
            updateOrderEntity: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: ProductService,
          useValue: {
            getEntityById: jest.fn().mockReturnValue(mockCarProduct),
            updateProductAverageStar: jest.fn().mockImplementation(() => {}),
          },
        },
      ],
    }).compile();
    feedbackService = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(FeedbackService).toBeDefined();
  });

  describe('productAverageStar', () => {
    it('should return product average star of product', async () => {
      const response = await feedbackService.productAverageStar(1);
      expect(response).toEqual(4.5);
    });
  });
  describe('queryFeedbackSummary', () => {
    it('should return feed back summary by star of product', async () => {
      const response = await feedbackService.queryFeedbackSummary(1);
      expect(response.length).toEqual(2);
      expect(response[0].rating).toEqual(4);
      expect(response[0].count).toEqual('2');
      expect(response[1].rating).toEqual(5);
      expect(response[1].count).toEqual('2');
    });
  });
  describe('findFeedBackByOrderId', () => {
    it('should return feedbackEntity if id is valid', async () => {
      const response = await feedbackService.findFeedBackByOrderId(1);
      expect(response.id).toEqual(1);
    });
    it('should return null if id is invalid', async () => {
      const response = await feedbackService.findFeedBackByOrderId(2);
      expect(response).toBeNull();
    });
  });
  describe('createFeedback', () => {
    it('should create new FeedbackEntity and return FeedbackDto if data is valid', async () => {
      const mockCreateFeedbackDto = {
        orderId: 2,
        content: 'Great experience',
        image: 'Image',
        star: 5,
      };
      jest
        .spyOn(ContextProvider, 'getAuthUser')
        .mockReturnValue(mockRenter as UserEntity);
      const response = await feedbackService.createFeedback(
        mockCreateFeedbackDto,
      );
      expect(response).toBeInstanceOf(FeedbackDto);
    });
    it('should throw BadRequestException if order already has feedback', async () => {
      try {
        const mockCreateFeedbackDto = {
          orderId: 1,
          content: 'Great experience',
          image: 'Image',
          star: 5,
        };
        jest
          .spyOn(ContextProvider, 'getAuthUser')
          .mockReturnValue(mockRenter as UserEntity);
        await feedbackService.createFeedback(mockCreateFeedbackDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw UnauthorizedException if order already has feedback', async () => {
      try {
        const mockCreateFeedbackDto = {
          orderId: 2,
          content: 'Great experience',
          image: 'Image',
          star: 5,
        };
        jest
          .spyOn(ContextProvider, 'getAuthUser')
          .mockReturnValue({ ...mockRenter, id: 5 } as UserEntity);
        await feedbackService.createFeedback(mockCreateFeedbackDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
  describe('getFeedbackList', () => {
    it('should return feedbackList based on options', async () => {
      const mockPageOptions = {
        sortField: FEEDBACK_LIST_SORT_FIELD.STAR,
        order: ORDER.DESC,
        page: 1,
        take: 10,
        skip: 0,
        productId: 1,
        haveImage: true,
        maxStar: 5,
        minStar: 1,
      };
      jest
        .spyOn(ContextProvider, 'getAuthUser')
        .mockReturnValue(mockRenter as UserEntity);
      const response = await feedbackService.getFeedbacksList(mockPageOptions);
      expect(response).toBeInstanceOf(PageDto<FeedbackDto>);
    });
  });
});
