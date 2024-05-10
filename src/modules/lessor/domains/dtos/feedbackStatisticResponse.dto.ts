import { ApiProperty } from '@nestjs/swagger';

import {
  FeedbackByRatingDto,
  FeedbackRecordDto,
} from './feedbackStatisticRecord.dto';

export class FeedbackStatisticResponseDto {
  @ApiProperty({ type: () => [FeedbackRecordDto] })
  chartData: FeedbackRecordDto[];

  @ApiProperty()
  totalFeedback: number;

  @ApiProperty()
  averageStar: number;

  @ApiProperty({ type: () => [FeedbackByRatingDto] })
  feedbackByRating: FeedbackByRatingDto[];
}
