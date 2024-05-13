import { SurchargeRepository } from '@/modules/surcharge/repositories/surcharge.repository';
import { SurchargeService } from '@/modules/surcharge/services/surcharge.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
describe('CategoryService', () => {
  let surchargeService: SurchargeService;
  const mockSurcharges = [
    {
      id: 1,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'products.surCharge.lateFees',
      description: 'products.surCharge.lateFees.description',
    },
    {
      id: 2,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'products.surCharge.sanityFees',
      description: 'products.surCharge.sanityFees.description',
    },
    {
      id: 3,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'products.surCharge.damageFees',
      description: 'products.surCharge.sanityFees.description',
    },
  ];
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurchargeService,
        {
          provide: SurchargeRepository,
          useValue: {
            find: jest.fn().mockReturnValue(mockSurcharges),
            findOneBy: jest
              .fn()
              .mockImplementation((options: { id?: number; name?: string }) => {
                if (options.id) {
                  return Promise.resolve(
                    mockSurcharges.find(
                      (surcharge) => surcharge.id === options.id,
                    ),
                  );
                } else if (options.name) {
                  return Promise.resolve(
                    mockSurcharges.find(
                      (surcharge) => surcharge.name === options.name,
                    ),
                  );
                }
                return null;
              }),
          },
        },
      ],
    }).compile();
    surchargeService = module.get<SurchargeService>(SurchargeService);
  });

  it('should be defined', () => {
    expect(surchargeService).toBeDefined();
  });

  describe('getAllSurcharges', () => {
    it('Should return all surcharges', async () => {
      const response = await surchargeService.getAllSurcharges();
      expect(response.length).toEqual(3);
    });
  });

  describe('getSurchargeById', () => {
    it('Should return specific surcharge if id is valid', async () => {
      const response = await surchargeService.getSurchargeById(1);
      expect(response.id).toEqual(1);
    });
    it('Should throw NotFoundException if id is invalid', async () => {
      try {
        await surchargeService.getSurchargeById(4);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('getSurchargeByName', () => {
    it('Should return specific surcharge if id is valid', async () => {
      const response = await surchargeService.getSurchargeByName(
        'products.surCharge.lateFees',
      );
      expect(response.name).toEqual('products.surCharge.lateFees');
    });
    it('Should throw NotFoundException if id is invalid', async () => {
      try {
        await surchargeService.getSurchargeByName('invalid');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
