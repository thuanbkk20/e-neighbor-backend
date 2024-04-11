import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { CreateInsuranceDto } from './createInsurace.dto';
import { CreateProductSurchargeDto } from './createProductSurcharge.dto';

import {
  MORTGAGE,
  MortgageType,
  REQUIRED_DOCUMENTS,
  RequiredDocumentsType,
} from '@/constants';
import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';
import { Characteristics } from '@/modules/product/domains/classes/policy.class';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsArray()
  policies: string[];

  @ApiProperty({ type: 'enum', enum: MORTGAGE })
  mortgage: MortgageType;

  @ApiProperty({ type: 'enum', enum: REQUIRED_DOCUMENTS })
  requiredDocuments: RequiredDocumentsType;

  @ApiProperty()
  @IsArray()
  images: string[];

  @ApiProperty({ type: Characteristics, isArray: true })
  @IsArray()
  characteristics: Characteristics[];

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ type: 'enum', enum: TIME_UNIT })
  timeUnit: TimeUnitType;

  @ApiProperty()
  @IsNumber()
  category: number;

  @ApiProperty({ type: CreateProductSurchargeDto, isArray: true })
  @IsArray()
  surcharge: CreateProductSurchargeDto[];

  @ApiPropertyOptional({ type: CreateInsuranceDto })
  insurance: CreateInsuranceDto;
}
