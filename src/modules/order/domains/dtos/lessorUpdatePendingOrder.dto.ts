import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class LessorUpdatePendingOrderDto {
  @ApiProperty()
  @IsNumber()
  orderId: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  isRejected: boolean = false;

  @ApiProperty({ default: '' })
  @IsString()
  rejectReason: string = '';
}
