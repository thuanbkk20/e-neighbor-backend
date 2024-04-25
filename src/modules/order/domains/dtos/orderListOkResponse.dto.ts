import { ApiProperty } from '@nestjs/swagger';

import { OrdersPageDto } from './orderPage.dto';

import { MetaStatusOkDto } from '@/common/dtos/meta-status-ok.dto';

export class OrderListOkResponse {
  @ApiProperty({ type: MetaStatusOkDto })
  meta: MetaStatusOkDto;

  @ApiProperty({ type: OrdersPageDto })
  result: OrdersPageDto;
}
