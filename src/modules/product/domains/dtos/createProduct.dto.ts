import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { Characteristics } from './../classes/policy.class';
import { CreateInsuranceDto } from './createInsurace.dto';
import { CreateProductSurchargeDto } from './createProductSurcharge.dto';

import {
  MORTGAGE_MAPPING,
  MortgageMappingType,
  REQUIRED_DOCUMENTS_MAPPING,
  RequiredDocumentsMappingType,
} from '@/constants';
import { TIME_UNIT, TimeUnitType } from '@/constants/time-unit';

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

  @ApiProperty({ type: 'enum', enum: MORTGAGE_MAPPING })
  mortgage: MortgageMappingType;

  @ApiProperty({ type: 'enum', enum: REQUIRED_DOCUMENTS_MAPPING })
  requiredDocuments: RequiredDocumentsMappingType;

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
