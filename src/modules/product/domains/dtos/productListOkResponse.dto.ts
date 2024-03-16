import { ApiProperty } from '@nestjs/swagger';

import { MetaStatusOkDto } from '../../../../common/dtos/meta-status-ok.dto';
import { ProductsPageDto } from './productsPage.dto';

export class ProductListOkResponse {
  @ApiProperty({ type: MetaStatusOkDto })
  meta: MetaStatusOkDto;

  @ApiProperty({ type: ProductsPageDto })
  result: ProductsPageDto;
}
