import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateInsuranceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  images: string[];

  @ApiProperty()
  issueDate: Date;

  @ApiProperty()
  expirationDate: Date;
}
