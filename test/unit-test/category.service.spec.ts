import { CategoryRepository } from '@/modules/category/repositories/category.repository';
import { CategoryService } from '@/modules/category/services/category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
describe('CategoryService', () => {
  let categoryService: CategoryService;
  const mockCategory = [
    {
      id: 1,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'furniture.category.couch',
      isVehicle: false,
      characteristics: [
        'furniture-characteristics-size',
        'furniture-characteristics-height',
        'furniture-characteristics-material',
        'furniture-characteristics-shape',
        'furniture-characteristics-weight',
        'furniture-characteristics-quantity',
        'furniture-characteristics-function',
        'furniture-characteristics-brand',
        'furniture-characteristics-origin',
        'furniture-characteristics-warranty-type',
        'furniture-characteristics-warranty-date',
      ],
    },
    {
      id: 2,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'furniture.category.table',
      isVehicle: false,
      characteristics: [
        'furniture-characteristics-size',
        'furniture-characteristics-height',
        'furniture-characteristics-material',
        'furniture-characteristics-shape',
        'furniture-characteristics-weight',
        'furniture-characteristics-quantity',
        'furniture-characteristics-function',
        'furniture-characteristics-brand',
        'furniture-characteristics-origin',
        'furniture-characteristics-warranty-type',
        'furniture-characteristics-warranty-date',
      ],
    },
    {
      id: 3,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'furniture.category.electronic',
      isVehicle: false,
      characteristics: [
        'furniture-characteristics-size',
        'furniture-characteristics-height',
        'furniture-characteristics-material',
        'furniture-characteristics-shape',
        'furniture-characteristics-weight',
        'furniture-characteristics-quantity',
        'furniture-characteristics-function',
        'furniture-characteristics-brand',
        'furniture-characteristics-origin',
        'furniture-characteristics-warranty-type',
        'furniture-characteristics-warranty-date',
        'furniture-characteristics-energyType',
      ],
    },
    {
      id: 4,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'furniture.category.decorations',
      isVehicle: false,
      characteristics: [
        'furniture-characteristics-quantity',
        'furniture-characteristics-function',
        'furniture-characteristics-brand',
        'furniture-characteristics-origin',
        'furniture-characteristics-warranty-type',
        'furniture-characteristics-warranty-date',
      ],
    },
    {
      id: 5,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'furniture.category.bed',
      isVehicle: false,
      characteristics: [
        'furniture-characteristics-size',
        'furniture-characteristics-height',
        'furniture-characteristics-material',
        'furniture-characteristics-shape',
        'furniture-characteristics-weight',
        'furniture-characteristics-quantity',
        'furniture-characteristics-function',
        'furniture-characteristics-brand',
        'furniture-characteristics-origin',
        'furniture-characteristics-warranty-type',
        'furniture-characteristics-warranty-date',
      ],
    },
    {
      id: 6,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'furniture.category.cabinet',
      isVehicle: false,
      characteristics: [
        'furniture-characteristics-size',
        'furniture-characteristics-height',
        'furniture-characteristics-material',
        'furniture-characteristics-shape',
        'furniture-characteristics-weight',
        'furniture-characteristics-quantity',
        'furniture-characteristics-function',
        'furniture-characteristics-brand',
        'furniture-characteristics-origin',
        'furniture-characteristics-warranty-type',
        'furniture-characteristics-warranty-date',
      ],
    },
    {
      id: 7,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'furniture.category.kitchen-appliances',
      isVehicle: false,
      characteristics: [
        'furniture-characteristics-size',
        'furniture-characteristics-height',
        'furniture-characteristics-material',
        'furniture-characteristics-shape',
        'furniture-characteristics-weight',
        'furniture-characteristics-quantity',
        'furniture-characteristics-function',
        'furniture-characteristics-brand',
        'furniture-characteristics-origin',
        'furniture-characteristics-warranty-type',
        'furniture-characteristics-warranty-date',
        'furniture-characteristics-energyType',
      ],
    },
    {
      id: 8,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
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
    },
    {
      id: 9,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'vehicle.category.motorbike',
      isVehicle: true,
      characteristics: [
        'vehicle-characteristics-seats',
        'vehicle-characteristics-fuel',
        'vehicle-characteristics-fuelRate',
        'vehicle-characteristics-utility-GPS',
        'vehicle-characteristics-weight',
      ],
    },
    {
      id: 10,
      createdAt: new Date('2024-05-11T01:44:05.407Z'),
      updatedAt: new Date('2024-05-11T01:44:05.407Z'),
      name: 'vehicle.category.bike',
      isVehicle: true,
      characteristics: [
        'vehicle-characteristics-seats',
        'vehicle-characteristics-fuel',
        'vehicle-characteristics-fuelRate',
        'vehicle-characteristics-utility-GPS',
        'vehicle-characteristics-weight',
      ],
    },
  ];
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            find: jest
              .fn()
              .mockImplementation(
                (option: {
                  select: { id: boolean; name: boolean };
                  where: { isVehicle?: boolean };
                }) => {
                  if (option.where.isVehicle === true) {
                    return Promise.resolve(
                      mockCategory.filter(
                        (category) => category.isVehicle === true,
                      ),
                    );
                  } else if (option.where.isVehicle === false) {
                    return Promise.resolve(
                      mockCategory.filter(
                        (category) => category.isVehicle === false,
                      ),
                    );
                  }
                  return Promise.resolve(mockCategory);
                },
              ),
            findOneBy: jest.fn().mockImplementation((param: { id: number }) => {
              const result = mockCategory.find(
                (category) => category.id === param.id,
              );
              return Promise.resolve(result);
            }),
          },
        },
      ],
    }).compile();
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const response = await categoryService.getAllCategories({});
      expect(response.length).toEqual(mockCategory.length);
    });

    it('should return vehicle categories', async () => {
      const response = await categoryService.getAllCategories({
        isVehicle: true,
      });
      expect(response.length).toEqual(3);
    });

    it('should return not vehicle categories', async () => {
      const response = await categoryService.getAllCategories({
        isVehicle: false,
      });
      expect(response.length).toEqual(7);
    });
  });

  describe('getAllCategories', () => {
    it('should return specific category', async () => {
      const response = await categoryService.findById(1);
      expect(response.id).toEqual(1);
    });
    it('should throw NotFoundException if id is invalid', async () => {
      try {
        await categoryService.findById(2);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
