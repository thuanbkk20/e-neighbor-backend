import { ApiProperty } from '@nestjs/swagger';

import { RevenueRecordDto } from './revenueStatisticRecord.dto';

export class RevenueStatisticResponseDto {
  @ApiProperty({ type: [RevenueRecordDto] })
  chartData: RevenueRecordDto[];

  @ApiProperty()
  totalRevenue: number;
}
