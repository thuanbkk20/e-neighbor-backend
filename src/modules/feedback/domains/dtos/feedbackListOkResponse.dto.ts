import { ApiProperty } from '@nestjs/swagger';

import { FeedbacksPageDto } from './feedbacksPage.dto';

import { MetaStatusOkDto } from '@/common/dtos/meta-status-ok.dto';

export class FeedbackListOkResponse {
  @ApiProperty({ type: MetaStatusOkDto })
  meta: MetaStatusOkDto;

  @ApiProperty({ type: FeedbacksPageDto })
  result: FeedbacksPageDto;
}
