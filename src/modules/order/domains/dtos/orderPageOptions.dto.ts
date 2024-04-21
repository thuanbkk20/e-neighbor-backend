import {
  ORDER,
  ORDER_LIST_SORT_FIELD,
  ORDER_STATUS,
  OrderListSortFieldType,
  OrderStatusType,
  OrderType,
  PAYMENT_STATUS,
  PaymentStatusType,
} from '@/constants';
import {
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '@/decorators';

export class OrderPageOptionsDto {
  @EnumFieldOptional(() => ORDER_LIST_SORT_FIELD, {
    default: ORDER_LIST_SORT_FIELD.CREATED_AT,
  })
  readonly sortField: OrderListSortFieldType = ORDER_LIST_SORT_FIELD.CREATED_AT;

  @EnumFieldOptional(() => ORDER, {
    default: ORDER.DESC,
  })
  readonly order: OrderType = ORDER.DESC;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 20,
    int: true,
  })
  readonly take: number = 20;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @NumberFieldOptional()
  readonly userId?: number;

  @NumberFieldOptional()
  readonly lessorId?: number;

  @NumberFieldOptional()
  readonly productId?: number;

  @StringFieldOptional()
  readonly productName?: string;

  @EnumFieldOptional(() => ORDER_STATUS)
  readonly orderStatus?: OrderStatusType;

  @EnumFieldOptional(() => PAYMENT_STATUS)
  readonly paymentStatus?: PaymentStatusType;

  @NumberFieldOptional()
  readonly maxValue?: number;

  @NumberFieldOptional()
  readonly minValue?: number;

  @NumberFieldOptional()
  readonly offset?: number;
}
