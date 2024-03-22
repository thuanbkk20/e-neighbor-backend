import { ApiProperty } from '@nestjs/swagger';

import { ProductsPageDto } from './productsPage.dto';

import { MetaStatusOkDto } from '@/common/dtos/meta-status-ok.dto';

export class ProductListOkResponse {
  @ApiProperty({ type: MetaStatusOkDto })
  meta: MetaStatusOkDto;

  @ApiProperty({ type: ProductsPageDto })
  result: ProductsPageDto;
}
