import { LessorRegisterDto } from './../../src/modules/lessor/domains/dtos/create-lessor.dto';
import { COMMON_LOCATION } from './../../src/constants/common-location';
import { UserUpdateDto } from './../../src/modules/user/domains/dtos/user-update.dto';
import { LessorEntity } from './../../src/modules/lessor/domains/entities/lessor.entity';
import { ProductEntity } from './../../src/modules/product/domains/entities/product.entity';
import { OrderEntity } from './../../src/modules/order/domains/entities/order.entity';
import { FeedbackEntity } from './../../src/modules/feedback/domains/entities/feedback.entity';
import { LessorRepository } from './../../src/modules/lessor/repositories/lessor.repository';
import { PAYMENT_METHOD } from './../../src/constants/payment-method';
import { UpdatePaymentMethodDto } from './../../src/modules/payment/domains/dtos/payment-method.dto';
import { PaymentService } from './../../src/modules/payment/services/payment.service';
import { UserEntity } from './../../src/modules/user/domains/entities/user.entity';
import { LessorNotFoundException } from './../../src/exceptions/lessor-not-found.exception';
import { LessorService } from './../../src/modules/lessor/services/lessor.service';
import { UserService } from './../../src/modules/user/services/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { ROLE } from '../../src/constants/role';
import { BadRequestException } from '@nestjs/common';

describe('LessorService', () => {
  let lessorService: LessorService;
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
    role: 'user',
    citizenId: '0123456789',
    citizenCardFront:
      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
    citizenCardBack:
      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
    wallet: 0,
    orders: [],
  };
  const mockLessor = {
    id: 1,
    createdAt: new Date('2024-05-11T01:44:05.473Z'),
    updatedAt: new Date('2024-05-11T01:44:05.473Z'),
    description: 'Dịch vụ cung cấp các mặt hàng cho thuê uy tín, chuyên nghiệp',
    wareHouseAddress:
      '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
    responseRate: null,
    responseTime: null,
    agreementRate: null,
    shopName: 'Dịch vụ cho thuê Minh Quang',
    location: 'common.location.HCM',
    user: {
      ...mockUser,
      role: 'lessor',
    },
  };
  const mockUpdatePaymentMethods = [
    {
      name: 'Momo',
      type: PAYMENT_METHOD.E_WALLET,
      accountNumber: '1234567890',
    },
  ];
  const mockPaymentMethod = {
    isInUsed: true,
    id: 1,
    createdAt: new Date('2024-05-11T07:57:40.995Z'),
    updatedAt: new Date('2024-05-11T07:57:40.995Z'),
    name: 'Momo',
    type: PAYMENT_METHOD.E_WALLET,
    accountNumber: '1234567890',
  };
  const mockLessorToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6Imxlc3NvciIsImlhdCI6MTcxNTUwNjcyMSwiZXhwIjoxODE1NTI0NzIxfQ.VO1BQ6twga9WbRc9uSXk8-kRgSv7IrqcgUkKlJJFFR4';
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessorService,
        {
          provide: LessorRepository,
          useValue: {
            findOneById: jest.fn().mockImplementation((id: number) => {
              if (id === 1) {
                return Promise.resolve(mockLessor);
              }
              return Promise.resolve(null);
            }),
            findOneByUserId: jest.fn().mockImplementation((id: number) => {
              if (id === 1) {
                return Promise.resolve(mockLessor);
              }
              return Promise.resolve(null);
            }),
            save: jest
              .fn()
              .mockImplementation((lessor: LessorEntity) =>
                Promise.resolve(lessor),
              ),
          },
        }, // Mock LessorRepository
        {
          provide: UserService,
          useValue: {
            findOneById: jest.fn().mockImplementation((userId: number) => {
              if (userId === 1) {
                return Promise.resolve(mockUser);
              }
              if (userId === 2) {
                return Promise.resolve({ ...mockUser, role: ROLE.LESSOR });
              }
              return null;
            }),
            registerLessor: jest
              .fn()
              .mockImplementation((registerDto: LessorRegisterDto) => {
                return Promise.resolve({ ...mockUser, role: ROLE.LESSOR });
              }),
            updateJwtUser: jest
              .fn()
              .mockImplementation((user: UserUpdateDto) => {
                return Promise.resolve((omit(mockUser), ['password']));
              }),
          },
        }, // Mock UserService
        {
          provide: JwtService,
          useValue: {
            signAsync: jest
              .fn()
              .mockImplementation(({ id: number, role: RoleType }) => {
                return Promise.resolve(mockLessorToken);
              }),
          },
        }, // Mock JwtService,
        {
          provide: PaymentService,
          useValue: {
            findByUserId: jest.fn().mockImplementation((userId: number) => {
              return [mockPaymentMethod];
            }),
            updateUserPaymentMethod: jest
              .fn()
              .mockImplementation(
                (user: UserEntity, methods: UpdatePaymentMethodDto) => {
                  return [mockPaymentMethod];
                },
              ),
          },
        }, // Mock PaymentService
        {
          provide: getRepositoryToken(FeedbackEntity),
          useValue: {},
        }, // Mock FeedbackRepository
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {},
        }, // Mock OrderRepository
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {},
        }, // Mock ProductRepository
      ],
    }).compile();
    lessorService = module.get<LessorService>(LessorService);
  });

  it('should be defined', () => {
    expect(lessorService).toBeDefined();
  });

  describe('findLessorById', () => {
    it('should return lessor lessorEntity if id is correct', async () => {
      const response = await lessorService.findOneById(1);
      expect(response).toEqual(mockLessor);
    });
    it('should throw LessorNotFoundException if id is not correct', async () => {
      try {
        await lessorService.findOneById(2);
      } catch (error) {
        expect(error).toBeInstanceOf(LessorNotFoundException);
      }
    });
  });

  describe('findLessorByUserId', () => {
    it('should return lessor lessorEntity if id is correct', async () => {
      const response = await lessorService.findOneByUserId(1);
      expect(response).toEqual(mockLessor);
    });
    it('should throw LessorNotFoundException if id is not correct', async () => {
      try {
        await lessorService.findOneByUserId(2);
      } catch (error) {
        expect(error).toBeInstanceOf(LessorNotFoundException);
      }
    });
  });

  describe('registerLessor', () => {
    it('create a new lessor and return a jwt', async () => {
      const registerDto = {
        userId: 1,
        email: 'user01@gmail.com',
        address: 'Ho Chi Minh',
        detailedAddress:
          '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
        description:
          'Dịch vụ cung cấp các mặt hàng cho thuê uy tín, chuyên nghiệp',
        dob: new Date('1998-07-27T23:00:00.000Z'),
        phoneNumber: '012345678',
        fullName: 'Nguyễn Minh Quang',
        citizenId: '0123456789',
        citizenCardFront:
          'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
        citizenCardBack:
          'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
        paymentInfo: mockUpdatePaymentMethods,
        wareHouseAddress:
          '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
        responseRate: null,
        responseTime: null,
        agreementRate: null,
        shopName: 'Dịch vụ cho thuê Minh Quang',
        location: COMMON_LOCATION.HCM,
      };
      const response = await lessorService.registerLessor(registerDto);
      expect(response.accessToken).toEqual(mockLessorToken);
    });
    it('should throw BadRequestException if user already lessor', async () => {
      try {
        const registerDto = {
          userId: 2,
          email: 'user01@gmail.com',
          address: 'Ho Chi Minh',
          detailedAddress:
            '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
          description:
            'Dịch vụ cung cấp các mặt hàng cho thuê uy tín, chuyên nghiệp',
          dob: new Date('1998-07-27T23:00:00.000Z'),
          phoneNumber: '012345678',
          fullName: 'Nguyễn Minh Quang',
          citizenId: '0123456789',
          citizenCardFront:
            'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
          citizenCardBack:
            'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
          paymentInfo: mockUpdatePaymentMethods,
          wareHouseAddress:
            '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
          responseRate: null,
          responseTime: null,
          agreementRate: null,
          shopName: 'Dịch vụ cho thuê Minh Quang',
          location: COMMON_LOCATION.HCM,
        };
        const response = await lessorService.registerLessor(registerDto);
        expect(response.accessToken).toEqual(mockLessorToken);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('lessorOnboard', () => {
    it('should create a new lessor and return a jwt', async () => {
      const registerDto = {
        id: 1,
        email: 'user01@gmail.com',
        address: 'Ho Chi Minh',
        detailedAddress:
          '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
        description:
          'Dịch vụ cung cấp các mặt hàng cho thuê uy tín, chuyên nghiệp',
        dob: new Date('1998-07-27T23:00:00.000Z'),
        phoneNumber: '012345678',
        fullName: 'Nguyễn Minh Quang',
        citizenId: '0123456789',
        citizenCardFront:
          'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
        citizenCardBack:
          'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
        paymentInfo: mockUpdatePaymentMethods,
        wareHouseAddress:
          '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
        responseRate: null,
        responseTime: null,
        agreementRate: null,
        shopName: 'Dịch vụ cho thuê Minh Quang',
        location: COMMON_LOCATION.HCM,
      };
      const response = await lessorService.lessorOnboard(registerDto);
      expect(response.accessToken).toEqual(mockLessorToken);
    });
  });
});
