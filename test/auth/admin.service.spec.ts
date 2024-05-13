import { AdminNotFoundException } from './../../src/exceptions/admin-not-found.exception';
import { AdminRepository } from '@/modules/admin/repositories/admin.repository';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Test, TestingModule } from '@nestjs/testing';
import e from 'express';
describe('CategoryService', () => {
  let adminService: AdminService;
  const mockAdmin = {
    id: 1,
    createdAt: new Date('2024-05-11T01:44:05.402Z'),
    updatedAt: new Date('2024-05-11T01:44:05.402Z'),
    userName: 'admin',
    password: '$2b$10$TH1kp30GPrWyHnJfU4/fQezAKBxpqbNmMbDJ8jpCHiuyaxWgKTqE.',
    email: 'thuan17082002@gmail.com',
    avatar: null,
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: AdminRepository,
          useValue: {
            findByUserName: jest.fn().mockImplementation((userName: string) => {
              if (userName === 'admin') return Promise.resolve(mockAdmin);
              return Promise.resolve(null);
            }),
            findOneBy: jest
              .fn()
              .mockImplementation((options: { id: number }) => {
                if (options.id === 1) return Promise.resolve(mockAdmin);
                return Promise.resolve(null);
              }),
          },
        },
      ],
    }).compile();
    adminService = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(AdminService).toBeDefined();
  });

  describe('findOneByUserName', () => {
    it('should return admin with valid userName', async () => {
      const response = await adminService.findOneByUserName('admin');
      expect(response.userName).toEqual('admin');
    });

    it('should throw AdminNotFoundException with invalid userName', async () => {
      try {
        await adminService.findOneByUserName('invalidUserName');
      } catch (error) {
        expect(error).toBeInstanceOf(AdminNotFoundException);
      }
    });
  });

  describe('findOneById', () => {
    it('should return admin with valid Id', async () => {
      const response = await adminService.findOneById(1);
      expect(response.id).toEqual(1);
    });

    it('should throw AdminNotFoundException with invalid id', async () => {
      try {
        await adminService.findOneById(2);
      } catch (error) {
        expect(error).toBeInstanceOf(AdminNotFoundException);
      }
    });
  });
});
