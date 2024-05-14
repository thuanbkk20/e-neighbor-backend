import { RegisterDto } from '../../src/modules/auth/domains/dtos/sign-in.dto';
import { LessorNotFoundException } from '../../src/exceptions/lessor-not-found.exception';
import { AdminNotFoundException } from '../../src/exceptions/admin-not-found.exception';
import { UserNotFoundException } from '../../src/exceptions/user-not-found.exception';
import { LessorService } from '../../src/modules/lessor/services/lessor.service';
import { AdminService } from '../../src/modules/admin/services/admin.service';
import { UserService } from '../../src/modules/user/services/user.service';
import { AuthService } from '../../src/modules/auth/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByUserName: jest
              .fn()
              .mockImplementation((userName: string) => {
                // Return UserEntity object for user01
                if (userName === 'user01') {
                  return Promise.resolve({
                    id: 1,
                    createdAt: '2024-05-11T01:44:05.468Z',
                    updatedAt: '2024-05-11T01:44:05.468Z',
                    userName: 'user01',
                    password:
                      '$2b$10$jHTdlcFzSzRyDXfBhpvTPeZ6gNHHebRPEeQMVsbJKiW0VMdS/gzxy',
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
                  });
                }
                // Throw exception for other username
                throw new UserNotFoundException();
              }),
            createUser: jest.fn().mockImplementation((param: RegisterDto) => {
              if (param.password === param.passwordConfirm) {
                if (
                  param.email == 'newEmail@gmail.com' &&
                  param.userName == 'newUserName' &&
                  param.fullName === 'NewFullName'
                ) {
                  return Promise.resolve({
                    id: 1,
                    createdAt: '2024-05-11T01:44:05.468Z',
                    updatedAt: '2024-05-11T01:44:05.468Z',
                    userName: 'newUserName',
                    password:
                      '$2b$10$jHTdlcFzSzRyDXfBhpvTPeZ6gNHHebRPEeQMVsbJKiW0VMdS/gzxy',
                    email: 'newEmal@gmail.com',
                    avatar:
                      'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png',
                    address: 'Ho Chi Minh',
                    detailedAddress:
                      '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
                    dob: '1998-07-27T23:00:00.000Z',
                    phoneNumber: '012345678',
                    fullName: 'New Fullname',
                    role: 'user',
                    citizenId: '0123456789',
                    citizenCardFront:
                      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
                    citizenCardBack:
                      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
                    wallet: 0,
                  });
                }
              }
              throw new BadRequestException();
            }),
            findByRequiredInfo: jest
              .fn()
              .mockImplementation((findOptions: any) => {
                if ((findOptions.userName = 'test@example.com')) {
                  return Promise.resolve(null);
                }
                if ((findOptions.userName = 'test@example.com')) {
                  return Promise.resolve({
                    id: 1,
                    createdAt: '2024-05-11T01:44:05.468Z',
                    updatedAt: '2024-05-11T01:44:05.468Z',
                    userName: 'existing@example.com',
                    password:
                      '$2b$10$jHTdlcFzSzRyDXfBhpvTPeZ6gNHHebRPEeQMVsbJKiW0VMdS/gzxy',
                    email: 'newEmal@gmail.com',
                    avatar:
                      'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png',
                    address: 'Ho Chi Minh',
                    detailedAddress:
                      '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
                    dob: '1998-07-27T23:00:00.000Z',
                    phoneNumber: '012345678',
                    fullName: 'New Fullname',
                    role: 'user',
                    citizenId: '0123456789',
                    citizenCardFront:
                      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
                    citizenCardBack:
                      'https://cdnimgen.vietnamplus.vn/t620/uploaded/wbxx/2021_02_24/chip_based_id_cards.jpg',
                    wallet: 0,
                  });
                }
              }),
          },
        }, // Mock UserService
        {
          provide: AdminService,
          useValue: {
            findOneByUserName: jest
              .fn()
              .mockImplementation((userName: string) => {
                // Return UserEntity object for user01
                if (userName === 'admin') {
                  return Promise.resolve({
                    id: 1,
                    createdAt: '2024-05-11T01:44:05.402Z',
                    updatedAt: '2024-05-11T01:44:05.402Z',
                    userName: 'admin',
                    password:
                      '$2b$10$TH1kp30GPrWyHnJfU4/fQezAKBxpqbNmMbDJ8jpCHiuyaxWgKTqE.',
                    email: 'thuan17082002@gmail.com',
                    avatar: null,
                  });
                }
                // Throw exception for other username
                throw new AdminNotFoundException();
              }),
          },
        }, // Mock AdminService
        {
          provide: LessorService,
          useValue: {
            findOneByUserId: jest.fn().mockImplementation((userId: number) => {
              // Return UserEntity object for user01
              if (userId === 1) {
                return Promise.resolve({
                  id: 1,
                  createdAt: '2024-05-11T01:44:05.473Z',
                  updatedAt: '2024-05-11T01:44:05.473Z',
                  description:
                    'Dịch vụ cung cấp các mặt hàng cho thuê uy tín, chuyên nghiệp',
                  wareHouseAddress:
                    '268 Lý Thường Kiệt, Phường 14, Quận 10, Thành Phố Hồ Chí Minh',
                  responseRate: null,
                  responseTime: null,
                  agreementRate: null,
                  shopName: 'Dịch vụ cho thuê Minh Quang',
                  location: 'common.location.HCM',
                  user: {
                    id: 1,
                    createdAt: '2024-05-11T01:44:05.468Z',
                    updatedAt: '2024-05-11T01:44:05.468Z',
                    userName: 'user01',
                    password:
                      '$2b$10$jHTdlcFzSzRyDXfBhpvTPeZ6gNHHebRPEeQMVsbJKiW0VMdS/gzxy',
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
                  },
                });
              }
              // Throw exception for other username
              throw new LessorNotFoundException();
            }),
          },
        }, // Mock LessorService
        {
          provide: JwtService,
          useValue: {
            signAsync: jest
              .fn()
              .mockImplementation((param: { id: number; role: string }) => {
                // Return UserEntity object for user01
                if (param.id === 1 && param.role === 'lessor') {
                  return Promise.resolve(
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6Imxlc3NvciIsImlhdCI6MTcxNTQxNzUxMiwiZXhwIjoxODE1NDM1NTEyfQ.qT5i7rb1486vycnLeypvYOHo42C-Kcfrlsj5gu1fGkY',
                  );
                }
                if (param.id === 1 && param.role === 'admin') {
                  return Promise.resolve(
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE1NDIwMjExLCJleHAiOjE4MTU0MzgyMTF9.e1AZJYpy2GfjXDv9R9_tbQY1BXjKu0xiydZFliSTk6c',
                  );
                }
              }),
            verifyAsync: jest
              .fn()
              .mockImplementation((token: string, { secret: string }) => {
                if (
                  token ===
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6Imxlc3NvciIsImlhdCI6MTcxNTQxNzUxMiwiZXhwIjoxODE1NDM1NTEyfQ.qT5i7rb1486vycnLeypvYOHo42C-Kcfrlsj5gu1fGkY'
                ) {
                  return {
                    id: 1,
                    role: 'lessor',
                  };
                } else if (
                  token ===
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE1NDIwMjExLCJleHAiOjE4MTU0MzgyMTF9.e1AZJYpy2GfjXDv9R9_tbQY1BXjKu0xiydZFliSTk6c'
                ) {
                  return {
                    id: 1,
                    role: 'admin',
                  };
                }
              }),
          },
        }, // Mock JwtService
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a JWT token when credentials are valid', async () => {
      const response = await authService.signIn({
        userName: 'user01',
        password: '12345678',
      });
      expect(response).toHaveProperty('accessToken');
      // Extract the role from the decoded payload

      const payload = await jwtService.verifyAsync(response.accessToken, {
        secret: '',
      });

      // Now you can assert that the role is as expected
      // For example, if you expect the role to be 'lessor'
      expect(payload.role).toEqual('lessor');
    });

    it('should throw an UserNotFound when username is invalid', async () => {
      expect.assertions(1); // Ensure one assertion is called

      try {
        await authService.signIn({
          userName: 'invalidUser', // Use an invalid username
          password: 'wrongPassword', // Or an incorrect password
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException); // Check if the error is an instance of UnauthorizedException
      }
    });

    it('should throw an UnauthorizedException when password is invalid', async () => {
      expect.assertions(1); // Ensure one assertion is called

      try {
        await authService.signIn({
          userName: 'user01', // Use an invalid username
          password: 'wrongPassword', // Or an incorrect password
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException); // Check if the error is an instance of UnauthorizedException
      }
    });
  });

  describe('adminSignIn', () => {
    it('should return a JWT token when credentials are valid', async () => {
      const response = await authService.adminSignIn({
        userName: 'admin',
        password: '12345678',
      });
      expect(response).toHaveProperty('accessToken');
    });

    it('should throw an AdminNotFound when username is invalid', async () => {
      expect.assertions(1); // Ensure one assertion is called

      try {
        await authService.adminSignIn({
          userName: 'invalidUser', // Use an invalid username
          password: 'wrongPassword', // Or an incorrect password
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AdminNotFoundException); // Check if the error is an instance of UnauthorizedException
      }
    });

    it('should throw an UnauthorizedException when password is invalid', async () => {
      expect.assertions(1); // Ensure one assertion is called

      try {
        await authService.adminSignIn({
          userName: 'admin', // Use an invalid username
          password: 'wrongPassword', // Or an incorrect password
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException); // Check if the error is an instance of UnauthorizedException
      }
    });
  });

  describe('userRegister', () => {
    it('should return a JWT token when credentials are valid', async () => {
      const data = new RegisterDto();
      data.userName = 'newUserName';
      data.email = 'newEmail@gmail.com';
      data.fullName = 'NewFullName';
      data.password = '12345678';
      data.passwordConfirm = '12345678';
      const response = await authService.userRegister(data);
      expect(response).toHaveProperty('accessToken');
    });
    it('should throw BadRequestException when credentials are valid', async () => {
      expect.assertions(1); // Ensure one assertion is called
      try {
        const data = new RegisterDto();
        data.userName = 'existingUserName';
        data.email = 'existingEmail@gmail.com';
        data.fullName = 'FullName';
        data.password = '12345678';
        data.passwordConfirm = '12345678';
        await authService.userRegister(data);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException); // Check if the error is an instance of UnauthorizedException
      }
    });
  });

  describe('googleLogin', () => {
    it('should register a new user and return a JWT token when the user does not exist', async () => {
      const mockReq = {
        user: {
          email: 'test@example.com',
          lastName: 'Test',
          firstName: 'User',
          picture: 'http://example.com/picture.jpg',
        },
      };

      jest.spyOn(userService, 'findByRequiredInfo').mockResolvedValue(null);
      jest
        .spyOn(authService, 'userRegisterByGoogle')
        .mockResolvedValue({ accessToken: 'sampleAccessToken' });

      const result = await authService.googleLogin(mockReq);

      expect(result).toHaveProperty('accessToken');
      expect(userService.findByRequiredInfo).toHaveBeenCalledWith({
        userName: mockReq.user.email,
      });
      expect(authService.userRegisterByGoogle).toHaveBeenCalledWith({
        userName: mockReq.user.email,
        email: mockReq.user.email,
        fullName: mockReq.user.lastName + ' ' + mockReq.user.firstName,
        password: mockReq.user.email,
        avatar: mockReq.user.picture,
      });
    });

    it('should return a JWT token for an existing user', async () => {
      const mockReq = {
        user: {
          email: 'existing@example.com',
          lastName: 'Existing',
          firstName: 'User',
          picture: 'http://example.com/picture.jpg',
        },
      };

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockToken');

      const result = await authService.googleLogin(mockReq);

      expect(result).toHaveProperty('accessToken');
      expect(userService.findByRequiredInfo).toHaveBeenCalledWith({
        userName: mockReq.user.email,
      });
    });
  });
});
