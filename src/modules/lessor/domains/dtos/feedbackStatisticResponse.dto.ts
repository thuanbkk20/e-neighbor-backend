import { ApiProperty } from '@nestjs/swagger';

import { FeedbackRecordDto } from './feedbackStatisticRecord.dto';

export class FeedbackStatisticResponseDto {
  @ApiProperty({ type: () => [FeedbackRecordDto] })
  chartData: FeedbackRecordDto[];

  @ApiProperty()
  totalFeedback: number;

  @ApiProperty()
  averageStar: number;
}
