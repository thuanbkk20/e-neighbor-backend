import { ApiProperty } from '@nestjs/swagger';

import { OrderRecordDto } from './orderRecord.dto';

import { PageMetaDto } from '@/common/dtos/page-meta.dto';

export class OrdersPageDto {
  @ApiProperty({ type: [OrderRecordDto] })
  readonly data: OrderRecordDto;

  @ApiProperty({ type: PageMetaDto })
  readonly meta: PageMetaDto;
}
