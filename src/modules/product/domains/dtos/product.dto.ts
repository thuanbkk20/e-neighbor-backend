import { InsuranceEntity } from './../entities/insurance.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusType } from '../../../../constants/status';
import { MortgageType, RequiredDocumentsType } from '../../../../constants';
import { Characteristics } from '../classes/policy.class';
import { TimeUnitType } from '../../../../constants/time-unit';
import { CategoryEntity } from '../../../category/domains/entities/category.entity';
import { LessorEntity } from '../../../lessor/domains/entities/lessor.entity';
import { ProductEntity } from '../entities/product.entity';
import { ProductSurChargeEntity } from '../entities/product-surcharge.entity';

export class ProductDto {
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

  @ApiProperty()
  lessor: LessorEntity;

  @ApiPropertyOptional()
  insurance?: InsuranceEntity;

  constructor(product: ProductEntity, insurance?: InsuranceEntity) {
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
    this.lessor = product.lessor;
    this.insurance = insurance;
  }
}
