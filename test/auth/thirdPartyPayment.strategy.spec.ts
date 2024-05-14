import { OrderNotFoundException } from '@/exceptions';
import {
  IPN_SUCCESS,
  IPN_ORDER_NOT_FOUND,
  INP_ORDER_ALREADY_PAID,
  IPN_INVALID_AMOUNT,
} from './../../src/constants/vnpay-ipn-response';
import { ProductDto } from '@/modules/product/domains/dtos/product.dto';
import { CreateOrderDto } from '@/modules/order/domains/dtos/createOrder.dto';
import { VnPayGateway } from './../../src/modules/thirdparty-payment/strategies/thirdparty-payment.strategy';
import {
  GATEWAY_STRATEGIES,
  LOCALE,
} from '@/modules/thirdparty-payment/strategies/thirdparty-payment.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { OrderService } from '../../src/modules/order/services/order.service';
import { ApiConfigService } from '../../src/shared/services/api-config.service';
import { ThirdpartyPaymentRepository } from '../../src/modules/thirdparty-payment/repositories/thirdparty-payment.repository';
import { DataSource } from 'typeorm';
import * as dayjs from 'dayjs';
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
import { OrderDto } from '../../src/modules/order/domains/dtos/order.dto';
describe('VnPayGateway', () => {
  let vnPayGateway: VnPayGateway;
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
    id: 5,
    createdAt: new Date('2024-05-11T20:01:25.796Z'),
    updatedAt: new Date('2024-05-11T20:01:25.796Z'),
    rentTime: new Date('2024-05-16 22:03:54'),
    returnTime: new Date('2024-05-18 22:03:54'),
    realRentTime: null,
    realReturnTime: null,
    conditionUponReceipt: null,
    imagesUponReceipt: null,
    conditionUponReturn: null,
    imagesUponReturn: null,
    deliveryAddress: 'address',
    orderValue: 1600000,
    orderStatus: ORDER_STATUS.COMPLETED,
    paymentStatus: PAYMENT_STATUS.INCOMPLETE,
    rentPrice: 800000,
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
        VnPayGateway,
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: OrderService,
          useValue: {
            createOrder: jest
              .fn()
              .mockImplementation(async (createOrderDto: CreateOrderDto) => {
                const productDto = new ProductDto(mockCarProduct, 0);
                return new OrderDto(mockOrder, productDto);
              }),
            findOrderEntityById: jest
              .fn()
              .mockImplementation(async (id: number) => {
                if (id === 5) return mockOrder;
                else if (id === 4)
                  return {
                    ...mockOrder,
                    paymentStatus: PAYMENT_STATUS.COMPLETE,
                  };
                throw new OrderNotFoundException();
              }),
          },
        },
        {
          provide: ApiConfigService,
          useValue: {
            vnPayConfig: {
              vnpUrl: 'VNP_URL',
              vnpVersion: 'VNP_VERSION',
              vnpTMNCode: 'VNP_TMVCODE',
              vnpBANKCODE: 'VNP_BANKCODE',
              vnpReturnUrl: 'VNP_RETURNURL',
              vnpHashSecret: 'VNP_HASHSECRET',
            },
          },
        },
        {
          provide: ThirdpartyPaymentRepository,
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(() => {}),
          },
        },
      ],
    }).compile();
    vnPayGateway = module.get<VnPayGateway>(VnPayGateway);
  });

  it('should be defined', () => {
    expect(vnPayGateway).toBeDefined();
  });

  describe('processPayment', () => {
    it('it should return a redirect link to payment page', async () => {
      const currentDate = dayjs();
      const mockCreateTransaction = {
        productId: 1,
        rentTime: currentDate.add(1, 'day').toDate(),
        returnTime: currentDate.add(2, 'day').toDate(),
        deliveryAddress: 'Binh Thanh, Ho Chi Minh',
        strategy: GATEWAY_STRATEGIES.vnpay,
        locale: LOCALE.vn,
      };
      const response = await vnPayGateway.processPayment(
        mockCreateTransaction,
        '162.198.1.1',
      );
      expect(response).toBeDefined();
    });
  });

  describe('saveTransaction', () => {
    it('it should save a transaction and update order payment status', async () => {
      const mockIpnQueryDto = {
        vnp_Amount: '160000000',
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: 'VNP14414820',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: 'Giao+dich+cho+Don+hang+5',
        vnp_PayDate: '20240514230426',
        vnp_ResponseCode: '00',
        vnp_TmnCode: 'I7Q47IH0',
        vnp_TransactionNo: '14414820',
        vnp_TransactionStatus: '00',
        vnp_TxnRef: '5',
        vnp_SecureHash:
          '64dd0664c63c8744433526f938cd0da73ae25ea61263c6e27bc2e01e53afc0cf1c404c4fc0f0126505b06b3d5442f54952c6e29b5d82a13a23d7417fdb873ded',
      };
      const response = await vnPayGateway.saveTransaction(mockIpnQueryDto);
      expect(response).toEqual(IPN_SUCCESS);
    });
    it('it should return order not found response if product id is invalid', async () => {
      const mockIpnQueryDto = {
        vnp_Amount: '160000000',
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: 'VNP14414820',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: 'Giao+dich+cho+Don+hang+1',
        vnp_PayDate: '20240514230426',
        vnp_ResponseCode: '00',
        vnp_TmnCode: 'I7Q47IH0',
        vnp_TransactionNo: '14414820',
        vnp_TransactionStatus: '00',
        vnp_TxnRef: '1',
        vnp_SecureHash:
          '64dd0664c63c8744433526f938cd0da73ae25ea61263c6e27bc2e01e53afc0cf1c404c4fc0f0126505b06b3d5442f54952c6e29b5d82a13a23d7417fdb873ded',
      };
      const response = await vnPayGateway.saveTransaction(mockIpnQueryDto);
      expect(response).toEqual(IPN_ORDER_NOT_FOUND);
    });
    it('it should return order already paid response if order already paid', async () => {
      const mockIpnQueryDto = {
        vnp_Amount: '160000000',
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: 'VNP14414820',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: 'Giao+dich+cho+Don+hang+4',
        vnp_PayDate: '20240514230426',
        vnp_ResponseCode: '00',
        vnp_TmnCode: 'I7Q47IH0',
        vnp_TransactionNo: '14414820',
        vnp_TransactionStatus: '00',
        vnp_TxnRef: '4',
        vnp_SecureHash:
          '64dd0664c63c8744433526f938cd0da73ae25ea61263c6e27bc2e01e53afc0cf1c404c4fc0f0126505b06b3d5442f54952c6e29b5d82a13a23d7417fdb873ded',
      };
      const response = await vnPayGateway.saveTransaction(mockIpnQueryDto);
      expect(response).toEqual(INP_ORDER_ALREADY_PAID);
    });
    it('it should return invalid amount response if vnp_Amount is invalid', async () => {
      mockOrder.paymentStatus = PAYMENT_STATUS.INCOMPLETE;
      const mockIpnQueryDto = {
        vnp_Amount: '1600000',
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: 'VNP14414820',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: 'Giao+dich+cho+Don+hang+5',
        vnp_PayDate: '20240514230426',
        vnp_ResponseCode: '00',
        vnp_TmnCode: 'I7Q47IH0',
        vnp_TransactionNo: '14414820',
        vnp_TransactionStatus: '00',
        vnp_TxnRef: '5',
        vnp_SecureHash:
          '64dd0664c63c8744433526f938cd0da73ae25ea61263c6e27bc2e01e53afc0cf1c404c4fc0f0126505b06b3d5442f54952c6e29b5d82a13a23d7417fdb873ded',
      };
      const response = await vnPayGateway.saveTransaction(mockIpnQueryDto);
      expect(response).toEqual(IPN_INVALID_AMOUNT);
    });
  });
});
