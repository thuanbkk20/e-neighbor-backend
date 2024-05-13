import { ProductViewDto } from './../../src/modules/product/domains/dtos/productView.dto';
import { ProductPageOptionsDto } from './../../src/modules/product/domains/dtos/productPageOption.dto';
import { ProductRecordDto } from './../../src/modules/product/domains/dtos/productRecord.dto';
import { PageDto } from './../../src/common/dtos/page.dto';
import { ORDER } from './../../src/constants/order';
import { PRODUCT_LIST_SORT_FIELD } from './../../src/constants/product-list-sort-field';
import { ProductMissingFieldException } from './../../src/exceptions/invalid-product.exception';
import { AbstractDto } from './../../src/common/dtos/abstract.dto';
import { ContextProvider } from './../../src/providers/context.provider';
import { SurchargeEntity } from './../../src/modules/surcharge/domains/entities/surcharge.entity';
import { CreateProductDto } from './../../src/modules/product/domains/dtos/createProduct.dto';
import { CategoryEntity } from './../../src/modules/category/domains/entities/category.entity';
import { STATUS } from './../../src/constants/status';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';
import { ProductNotFoundException } from '@/exceptions/product-not-found.exception';
import { ProductDto } from '@/modules/product/domains/dtos/product.dto';
import { InsuranceEntity } from '@/modules/product/domains/entities/insurance.entity';
import { OrderService } from '@/modules/order/services/order.service';
import { InsuranceRepository } from '@/modules/product/repositories/insurance.repository';
import { SurchargeService } from '@/modules/surcharge/services/surcharge.service';
import { ProductRepository } from '@/modules/product/repositories/product.reposiory';
import { CategoryService } from '@/modules/category/services/category.service';
import { ProductService } from '@/modules/product/services/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LessorService } from '../../src/modules/lessor/services/lessor.service';
import { EntityManager } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { COMMON_LOCATION } from '../../src/constants/common-location';
import { ROLE } from '../../src/constants/role';
import { LessorNotFoundException } from '../../src/exceptions/lessor-not-found.exception';

describe('CategoryService', () => {
  let productService: ProductService;
  // Mock entityManager
  const entityManager = {} as EntityManager;
  entityManager.save = jest
    .fn()
    .mockImplementation((entity) => Promise.resolve(entity));
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
  const mockCarProduct = {
    accessCount: 0,
    id: 1,
    createdAt: new Date('2024-05-11T01:44:05.478Z'),
    updatedAt: new Date('2024-05-11T01:44:05.478Z'),
    name: 'Toyota Camry 2023',
    status: STATUS.AVAILABLE,
    mortgage: 'product.mortgage.motorbike.deposite',
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
    requiredDocuments: 'product.reqDocs.need.citizenCard.with.driverLicense',
    timeUnit: 'product.price.time.unit.day',
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
    },
    lessor: mockLessor,
    productSurcharges: [],
  };
  const mockCarProduct2 = {
    ...mockCarProduct,
    id: 2,
  };
  const mockUnConfirmedProduct = {
    ...mockCarProduct,
    isConfirmed: false,
    id: 3,
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: LessorService,
          useValue: {
            findOneById: jest.fn().mockImplementation((id: number) => {
              if (id === 1) {
                return mockLessor;
              }
              throw new LessorNotFoundException();
            }),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findById: jest.fn().mockImplementation((id: number) => {
              const category = new CategoryEntity();
              if (id >= 1 && id <= 10) return Promise.resolve(category);
              throw new NotFoundException();
            }),
          },
        },
        {
          provide: ProductRepository,
          useValue: {
            manager: {
              transaction: jest.fn().mockImplementation(async (callback) => {
                return callback(entityManager);
              }),
            },
            findOneById: jest.fn().mockImplementation((id: number) => {
              switch (id) {
                case 1:
                  return Promise.resolve(mockCarProduct as ProductEntity);
                case 2:
                  return Promise.resolve(mockCarProduct2 as ProductEntity);
                case 3:
                  return Promise.resolve(
                    mockUnConfirmedProduct as ProductEntity,
                  );
                default:
                  return null;
              }
            }),
            save: jest
              .fn()
              .mockImplementation((productEntity) =>
                Promise.resolve(productEntity),
              ),
            getProductList: jest.fn().mockReturnValue({
              entities: [mockCarProduct, mockCarProduct2],
              itemCount: 2,
            }),
            getTopFourViewedProductList: jest.fn().mockReturnValue({
              getRawAndEntities: jest.fn().mockReturnValue({
                entities: [mockCarProduct, mockCarProduct2],
              }),
              getCount: jest.fn().mockReturnValue(2),
            }),
            getTopFourRatedProductList: jest.fn().mockReturnValue({
              getRawAndEntities: jest.fn().mockReturnValue({
                entities: [mockCarProduct, mockCarProduct2],
              }),
              getCount: jest.fn().mockReturnValue(2),
            }),
          },
        },
        {
          provide: SurchargeService,
          useValue: {
            getSurchargeById: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve(new SurchargeEntity()),
              ),
            getSurchargeByName: jest
              .fn()
              .mockReturnValue(new SurchargeEntity()),
          },
        },
        {
          provide: InsuranceRepository,
          useValue: {
            findByProductId: jest
              .fn()
              .mockReturnValue(Promise.resolve(new InsuranceEntity())),
          },
        },
        {
          provide: OrderService,
          useValue: {
            numberOfOrderByStatus: jest
              .fn()
              .mockReturnValue(Promise.resolve(0)),
          },
        },
        {
          provide: ContextProvider,
          useValue: {
            getAuthUser: jest.fn().mockImplementation(() => {
              return mockLessor;
            }),
          },
        },
      ],
    }).compile();
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(ProductService).toBeDefined();
  });

  describe('findOneById', () => {
    it('Should return a ProductDto if id is valid', async () => {
      const response = await productService.findOneById(1);
      expect(response).toBeInstanceOf(ProductDto);
      expect(response.id).toEqual(1);
    });
    it('Should throw ProductNotFoundException if id is invalid', async () => {
      try {
        await productService.findOneById(100);
      } catch (error) {
        expect(error).toBeInstanceOf(ProductNotFoundException);
      }
    });
  });

  describe('getEntityById', () => {
    it('Should return a ProductEntity if id is valid', async () => {
      const response = await productService.getEntityById(1);
      expect(response.id).toEqual(1);
    });
    it('Should throw ProductNotFoundException if id is invalid', async () => {
      try {
        await productService.findOneById(100);
      } catch (error) {
        expect(error).toBeInstanceOf(ProductNotFoundException);
      }
    });
  });

  describe('getProductsList', () => {
    it('should return a list of product based on page options', async () => {
      const mockPageOptions = {
        sortField: PRODUCT_LIST_SORT_FIELD.ACCESS_COUNT,
        order: ORDER.DESC,
        page: 1,
        take: 12,
        isConfirmedByAdmin: true,
        isRejected: false,
        isVehicle: true,
        lessorId: 1,
        rating: 4,
        location: COMMON_LOCATION.HCM,
        maxPrice: 1000000,
        minPrice: 200000,
        skip: 0,
      };
      const response = await productService.getProductsList(mockPageOptions);
      expect(response).toBeInstanceOf(PageDto<ProductRecordDto>);
      expect(response.meta.take).toEqual(12);
      expect(response.meta.itemCount).toEqual(2);
    });
  });

  describe('getMostViewedProducts', () => {
    it('should return a list of most viewed product based on options', async () => {
      const mockPageOptions = {
        sortField: PRODUCT_LIST_SORT_FIELD.ACCESS_COUNT,
        order: ORDER.DESC,
        page: 1,
        take: 12,
        isConfirmedByAdmin: true,
        isRejected: false,
        isVehicle: true,
        lessorId: 1,
        rating: 4,
        location: COMMON_LOCATION.HCM,
        maxPrice: 1000000,
        minPrice: 200000,
        skip: 0,
      };
      const response =
        await productService.getMostViewedProducts(mockPageOptions);
      expect(response).toBeInstanceOf(PageDto<ProductViewDto>);
      expect(response.meta.take).toEqual(12);
      expect(response.meta.itemCount).toEqual(2);
    });
  });

  describe('getMostRatedProducts', () => {
    it('should return a list of most rated product based on options', async () => {
      const mockPageOptions = {
        sortField: PRODUCT_LIST_SORT_FIELD.ACCESS_COUNT,
        order: ORDER.DESC,
        page: 1,
        take: 12,
        isConfirmedByAdmin: true,
        isRejected: false,
        isVehicle: true,
        lessorId: 1,
        rating: 4,
        location: COMMON_LOCATION.HCM,
        maxPrice: 1000000,
        minPrice: 200000,
        skip: 0,
      };
      const response =
        await productService.getMostRatedProducts(mockPageOptions);
      expect(response).toBeInstanceOf(PageDto<ProductViewDto>);
      expect(response.meta.take).toEqual(12);
      expect(response.meta.itemCount).toEqual(2);
    });
  });

  describe('createProduct', () => {
    it('Should create a new product if data is valid', async () => {
      const mockCreateProductDto = new CreateProductDto();
      mockCreateProductDto.name = 'Honda Winner X 2023';
      mockCreateProductDto.description = 'Xe mới, chất lượng';
      mockCreateProductDto.value = 45000000;
      mockCreateProductDto.policies = ['product.policies.correctPurpose'];
      mockCreateProductDto.mortgage = 'product.mortgage.none';
      mockCreateProductDto.requiredDocuments = 'product.reqDocs.none';
      mockCreateProductDto.images = ['image1', 'image2'];
      mockCreateProductDto.characteristics = [
        {
          localeId: 'vehicle-characteristics-weight',
          description: '100',
        },
      ];
      mockCreateProductDto.price = 100000;
      mockCreateProductDto.timeUnit = 'product.price.time.unit.day';
      mockCreateProductDto.category = 9;
      mockCreateProductDto.surcharge = [
        {
          surchargeId: 2,
          price: 100000,
        },
      ];
      mockCreateProductDto.insurance = {
        name: 'Bảo hiểm tai nạn',
        description:
          'Đền bù thiệt hại trong trường hợp bị tai nạn khi đang tham gia giao thông',
        images: ['string'],
        issueDate: new Date('2024-05-13T13:04:08.417Z'),
        expirationDate: new Date('2024-05-13T13:04:08.417Z'),
      };
      jest.spyOn(ContextProvider, 'getAuthUser').mockReturnValue(mockLessor);
      const response = await productService.createProduct(mockCreateProductDto);
      expect(response).toBeInstanceOf(ProductDto);
      expect(response.name).toEqual('Honda Winner X 2023');
    });

    it('Should throw an exception if data is invalid', async () => {
      try {
        const mockCreateProductDto = new CreateProductDto();
        mockCreateProductDto.name = 'Honda Winner X 2023';
        mockCreateProductDto.description = 'Xe mới, chất lượng';
        mockCreateProductDto.value = 45000000;
        mockCreateProductDto.policies = ['product.policies.correctPurpose'];
        mockCreateProductDto.mortgage = 'product.mortgage.none';
        mockCreateProductDto.requiredDocuments = 'product.reqDocs.none';
        mockCreateProductDto.images = ['image1', 'image2'];
        mockCreateProductDto.characteristics = [
          {
            localeId: 'vehicle-characteristics-weight',
            description: '100',
          },
        ];
        mockCreateProductDto.price = 100000;
        mockCreateProductDto.timeUnit = 'product.price.time.unit.day';
        mockCreateProductDto.category = 8;
        mockCreateProductDto.surcharge = [
          {
            surchargeId: 2,
            price: 100000,
          },
        ];
        jest.spyOn(ContextProvider, 'getAuthUser').mockReturnValue(mockLessor);
        await productService.createProduct(mockCreateProductDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ProductMissingFieldException);
      }
    });
  });

  describe('adminConfirmProduct', () => {
    it('should update isConfirmed of product to true', async () => {
      const mockConfirmDto = {
        productId: 2,
        isConfirm: true,
      };
      const response = await productService.adminConfirmProduct(mockConfirmDto);
      expect(response).toBeInstanceOf(ProductDto);
      expect(response.id).toEqual(2);
      expect(response.isConfirmed).toEqual(true);
    });
    it('should update isConfirmed of product to false and update rejectReason', async () => {
      const mockConfirmDto = {
        productId: 2,
        isConfirm: false,
        rejectReason: 'Invalid Product',
      };
      const response = await productService.adminConfirmProduct(mockConfirmDto);
      expect(response).toBeInstanceOf(ProductDto);
      expect(response.id).toEqual(mockConfirmDto.productId);
      expect(response.isConfirmed).toEqual(mockConfirmDto.isConfirm);
      expect(response.rejectReason).toEqual(mockConfirmDto.rejectReason);
    });
    it('should throw ProductNotFoundException if productId is invalid', async () => {
      try {
        const mockConfirmDto = {
          productId: 100,
          isConfirm: false,
          rejectReason: 'Invalid Product',
        };
        await productService.adminConfirmProduct(mockConfirmDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ProductNotFoundException);
      }
    });
  });
});
