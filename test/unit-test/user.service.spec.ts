import { PAYMENT_METHOD } from './../../src/constants/payment-method';
import { PAYMENT_TYPE } from './../../src/constants/payment-type';
import { PaymentMethodEntity } from './../../src/modules/payment/domains/entities/payment-method.entity';
import { DuplicatePaymentMethodException } from './../../src/exceptions/duplicate-payment-method.exception';
import {
  AddPaymentMethodDto,
  UpdatePaymentMethodDto,
} from './../../src/modules/payment/domains/dtos/payment-method.dto';
import { PaymentService } from './../../src/modules/payment/services/payment.service';
import { UserRepository } from './../../src/modules/user/repositories/user.repository';
import { UserEntity } from './../../src/modules/user/domains/entities/user.entity';
import { ROLE } from './../../src/constants/role';
import { RegisterDto } from './../../src/modules/auth/domains/dtos/sign-in.dto';
import { LessorNotFoundException } from './../../src/exceptions/lessor-not-found.exception';
import { AdminNotFoundException } from './../../src/exceptions/admin-not-found.exception';
import { UserNotFoundException } from './../../src/exceptions/user-not-found.exception';
import { LessorService } from './../../src/modules/lessor/services/lessor.service';
import { AdminService } from './../../src/modules/admin/services/admin.service';
import { UserService } from './../../src/modules/user/services/user.service';
import { AuthService } from './../../src/modules/auth/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  const mockUser = {
    id: 1,
    createdAt: '2024-05-11T01:44:05.468Z',
    updatedAt: '2024-05-11T01:44:05.468Z',
    userName: 'user01',
    password: '$2b$10$jHTdlcFzSzRyDXfBhpvTPeZ6gNHHebRPEeQMVsbJKiW0VMdS/gzxy',
    email: 'user01@gmail.com',
    avatar:
      'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png',
    address: 'Ho Chi Minh',
    detailedAddress:
      '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
    dob: '1998-07-27T23:00:00.000Z',
    phoneNumber: '012345678',
    fullName: 'Nguyễn Minh Quang',
    role: 'lessor',
    citizenId: '0123456789',
    citizenCardFront:
      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
    citizenCardBack:
      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
    wallet: 0,
  };
  const mockPaymentMethod = {
    isInUsed: true,
    id: 1,
    createdAt: '2024-05-11T07:57:40.995Z',
    updatedAt: '2024-05-11T07:57:40.995Z',
    name: 'Viettin bank',
    type: 'BANKING',
    accountNumber: '0123456789',
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findOneBy: jest
              .fn()
              .mockImplementation((options: { id: number }) => {
                // Return UserEntity object for user01
                if (options.id === 1) {
                  return Promise.resolve(mockUser);
                }
                // Throw exception for other username
                return null;
              }),
            updateUser: jest
              .fn()
              .mockImplementation((user: any) => Promise.resolve(user)),
            findUserByUserName: jest
              .fn()
              .mockImplementation((userName: string) => {
                if (userName === 'user01') return mockUser;
                return null;
              }),
          },
        }, // Mock UserRepository
        {
          provide: PaymentService,
          useValue: {
            findByUserId: jest.fn().mockImplementation((userId: number) => {
              return [mockPaymentMethod];
            }),
            addUserPaymentMethod: jest
              .fn()
              .mockImplementation(
                (paymentMethod: AddPaymentMethodDto, user: UserEntity) => {
                  if (
                    paymentMethod.type === 'BANKING' &&
                    paymentMethod.name === 'Viettin bank' &&
                    paymentMethod.accountNumber === '0123456789'
                  ) {
                    throw new DuplicatePaymentMethodException(
                      'Payment method already exists',
                    );
                  }
                  return paymentMethod;
                },
              ),
            updateUserPaymentMethod: jest
              .fn()
              .mockImplementation(
                (
                  user: UserEntity,
                  paymentMethods: UpdatePaymentMethodDto[],
                ) => {
                  if (paymentMethods.length === 0) {
                    let updatedPaymentMethod = mockPaymentMethod;
                    updatedPaymentMethod.isInUsed = false;
                    return [updatedPaymentMethod];
                  }
                  const updatePaymentMethod = {
                    isInUsed: true,
                    id: 2,
                    createdAt: '2024-05-11T07:57:40.995Z',
                    updatedAt: '2024-05-11T07:57:40.995Z',
                    name: 'Momo',
                    type: 'E WALLET',
                    accountNumber: '1234567890',
                  };
                  return [updatePaymentMethod, mockPaymentMethod];
                },
              ),
          },
        }, // Mock PaymentService
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('updateUser', () => {
    it('should update existing user and return UserDto when all param is valid and password is correct', async () => {
      const updateOptions = {
        id: 1,
        password: '12345678',
        avatar: 'newAvatar',
      };
      const response = await userService.updateUser(updateOptions);
      expect(response).not.toHaveProperty('password');
      expect(response.avatar).toEqual('newAvatar');
    });
    it('should throw UserNotFoundException when userId is not correct', async () => {
      expect.assertions(1); // Ensure one assertion is called
      try {
        const updateOptions = {
          id: 2,
          password: '12345678',
          avatar: 'newAvatar',
        };
        const response = await userService.updateUser(updateOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
    it('should throw UnauthorizedException when userId is not correct', async () => {
      expect.assertions(1); // Ensure one assertion is called
      try {
        const updateOptions = {
          id: 1,
          password: '1234',
          avatar: 'newAvatar',
        };
        const response = await userService.updateUser(updateOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('getUserPaymentMethod', () => {
    it('should return userPayment method', async () => {
      const response = await userService.getUserPaymentInfo(1);
      expect(response).toEqual([mockPaymentMethod]);
    });
    it('should throw UserNotFoundException when userId is invalid', async () => {
      try {
        const response = await userService.getUserPaymentInfo(2);
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
  });

  describe('addUserPaymentMethod', () => {
    it('should add new payment method and return that payment method', async () => {
      const addPaymentMethodDto = new AddPaymentMethodDto();
      addPaymentMethodDto.userId = 1;
      addPaymentMethodDto.name = 'Momo';
      addPaymentMethodDto.type = 'E WALLET';
      addPaymentMethodDto.accountNumber = '1234567890';

      const response = await userService.addPaymentMethod(addPaymentMethodDto);
      expect(response).toEqual(addPaymentMethodDto);
    });
    it('should throw UserNotFoundException when userId is invalid', async () => {
      try {
        const addPaymentMethodDto = new AddPaymentMethodDto();
        addPaymentMethodDto.userId = 2;
        addPaymentMethodDto.name = 'Momo';
        addPaymentMethodDto.type = 'E WALLET';
        addPaymentMethodDto.accountNumber = '1234567890';
        const response =
          await userService.addPaymentMethod(addPaymentMethodDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
    it('should throw DuplicatePaymentMethodException when add an exist payment method', async () => {
      try {
        const addPaymentMethodDto = new AddPaymentMethodDto();
        addPaymentMethodDto.userId = 1;
        addPaymentMethodDto.name = 'Viettin bank';
        addPaymentMethodDto.type = 'BANKING';
        addPaymentMethodDto.accountNumber = '0123456789';
        const response =
          await userService.addPaymentMethod(addPaymentMethodDto);
      } catch (error) {
        expect(error).toBeInstanceOf(DuplicatePaymentMethodException);
      }
    });
  });
  describe('updateUserPaymentMethod', () => {
    it("should update user's payment methods", async () => {
      const UpdatePaymentMethods = [
        {
          name: 'Momo',
          type: PAYMENT_METHOD.E_WALLET,
          accountNumber: '1234567890',
        },
      ];
      const response = await userService.updatePaymentMethod(
        mockUser.id,
        UpdatePaymentMethods,
      );
      expect(response.length).toEqual(2);
    });
    it("should update user's old payment methods isInUsed to false", async () => {
      const UpdatePaymentMethods = [];
      const response = await userService.updatePaymentMethod(
        mockUser.id,
        UpdatePaymentMethods,
      );
      expect(response.length).toEqual(1);
      expect(response[0].isInUsed).toEqual(false);
    });
  });
});
