import { ApiProperty } from '@nestjs/swagger';

import { ProductRecordDto } from './productRecord.dto';

import { PageMetaDto } from '@/common/dtos/page-meta.dto';

export class ProductsPageDto {
  @ApiProperty({ type: [ProductRecordDto] })
  readonly data: ProductRecordDto;

  @ApiProperty({ type: PageMetaDto })
  readonly meta: PageMetaDto;
}
