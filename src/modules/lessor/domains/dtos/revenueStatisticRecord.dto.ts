import { ApiProperty } from '@nestjs/swagger';

export class RevenueRecordDto {
  @ApiProperty()
  revenue: number;

  @ApiProperty()
  time: Date;
}
