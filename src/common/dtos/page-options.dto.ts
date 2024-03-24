import { ORDER, OrderType } from '@/constants';
import {
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '@/decorators';

export class PageOptionsDto {
  @EnumFieldOptional(() => ORDER, {
    default: ORDER.ASC,
  })
  readonly order: OrderType = ORDER.ASC;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @NumberFieldOptional({
    minimum: 0,
    int: true,
  })
  readonly offset?: number;

  @StringFieldOptional()
  readonly q?: string;
}
