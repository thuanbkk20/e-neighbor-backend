import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class AdminConfirmDto {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsBoolean()
  isConfirm: boolean;

  @ApiPropertyOptional()
  rejectReason?: string;
}
