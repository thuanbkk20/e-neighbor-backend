import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UpdatePaymentMethodDto } from '@/modules/payment/domains/dtos/payment-method.dto';

export class LessorRegisterDto {
  @ApiProperty()
  @IsString()
  userId: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  detailedAddress: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  CCCD: string;

  @ApiProperty()
  paymentInfo: UpdatePaymentMethodDto[];

  @ApiProperty()
  @IsString()
  wareHouseAddress: string;

  @ApiPropertyOptional()
  @IsString()
  description?: string;
}
