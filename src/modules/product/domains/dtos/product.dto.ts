import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { MortgageType, RequiredDocumentsType } from '@/constants';
import { StatusType } from '@/constants/status';
import { TimeUnitType } from '@/constants/time-unit';
import { CategoryEntity } from '@/modules/category/domains/entities/category.entity';
import { Characteristics } from '@/modules/product/domains/classes/policy.class';
import { InsuranceEntity } from '@/modules/product/domains/entities/insurance.entity';
import { ProductSurChargeEntity } from '@/modules/product/domains/entities/product-surcharge.entity';
import { ProductEntity } from '@/modules/product/domains/entities/product.entity';

export class ProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: StatusType;

  @ApiProperty()
  mortgage: MortgageType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  policies: string[];

  @ApiProperty()
  images: string[];

  @ApiProperty()
  characteristics: Characteristics[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  requiredDocuments: RequiredDocumentsType;

  @ApiProperty()
  timeUnit: TimeUnitType;

  @ApiProperty()
  category: CategoryEntity;

  @ApiProperty()
  productSurcharges: ProductSurChargeEntity[];

  @ApiProperty()
  isConfirmed: boolean;

  @ApiPropertyOptional()
  rejectReason?: string;

  @ApiProperty()
  lessor: object;

  @ApiPropertyOptional()
  insurance?: InsuranceEntity;

  @ApiProperty()
  accessCount: number;

  @ApiProperty()
  averageStar: number;

  @ApiProperty()
  numberOfCompletedOrders: number;

  constructor(
    product: ProductEntity,
    numberOfCompletedOrders: number,
    insurance?: InsuranceEntity,
  ) {
    this.id = product.id;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    this.name = product.name;
    this.status = product.status;
    this.mortgage = product.mortgage;
    this.description = product.description;
    this.value = product.value;
    this.policies = product.policies;
    this.images = product.images;
    this.characteristics = product.characteristics;
    this.price = product.price;
    this.requiredDocuments = product.requiredDocuments;
    this.timeUnit = product.timeUnit;
    this.category = product.category;
    this.productSurcharges = product.productSurcharges;
    this.isConfirmed = product.isConfirmed;
    this.rejectReason = product.rejectReason;
    this.lessor = {
      id: product.lessor.id,
      description: product.lessor.description,
      wareHouseAddress: product.lessor.wareHouseAddress,
      responseRate: product.lessor.responseRate,
      responseTime: product.lessor.responseTime,
      agreementRate: product.lessor.agreementRate,
      avatar: product.lessor.user.avatar,
    };
    this.accessCount = product.accessCount;
    this.averageStar = product.rating;
    this.numberOfCompletedOrders = numberOfCompletedOrders;
    this.insurance = insurance;
  }
}
