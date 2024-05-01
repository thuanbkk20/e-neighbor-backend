import { ApiProperty } from '@nestjs/swagger';

import { FeedbackDto } from './feedback.dto';

import { PageMetaDto } from '@/common/dtos/page-meta.dto';

export class FeedbacksPageDto {
  @ApiProperty({ type: [FeedbackDto] })
  readonly data: FeedbackDto;

  @ApiProperty({ type: PageMetaDto })
  readonly meta: PageMetaDto;
}
