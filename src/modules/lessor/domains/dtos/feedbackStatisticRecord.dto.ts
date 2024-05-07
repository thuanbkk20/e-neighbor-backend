import { ApiProperty } from '@nestjs/swagger';

export class FeedbackRecordDto {
  @ApiProperty()
  averageStar: number;

  @ApiProperty()
  totalFeedback: number;

  @ApiProperty()
  time: Date;
}
