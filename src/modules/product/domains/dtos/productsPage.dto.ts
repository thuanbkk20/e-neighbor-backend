import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { ProductRecordDto } from './productRecord.dto';

export class ProductsPageDto {
  @ApiProperty({ type: [ProductRecordDto] })
  readonly data: ProductRecordDto;

  @ApiProperty({ type: PageMetaDto })
  readonly meta: PageMetaDto;
}
