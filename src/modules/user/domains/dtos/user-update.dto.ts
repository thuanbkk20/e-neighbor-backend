import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

import { ROLE } from '@/constants';

export class UserUpdateDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  password?: string;

  @ApiPropertyOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  detailedAddress?: string;

  @ApiPropertyOptional()
  @IsDate()
  dob?: Date;

  @ApiPropertyOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsEnum(ROLE)
  role?: string;

  @ApiPropertyOptional()
  @IsString()
  CCCD?: string;

  @ApiPropertyOptional()
  updatedAt?: Date = new Date();
}
