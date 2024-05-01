import {
  FEEDBACK_LIST_SORT_FIELD,
  FeedbackListSortFieldType,
  ORDER,
  OrderType,
} from '@/constants';
import {
  BooleanFieldOptional,
  EnumFieldOptional,
  NumberField,
  NumberFieldOptional,
} from '@/decorators';

export class FeedbackPageOptionsDto {
  @EnumFieldOptional(() => FEEDBACK_LIST_SORT_FIELD, {
    default: FEEDBACK_LIST_SORT_FIELD.CREATED_AT,
  })
  readonly sortField: FeedbackListSortFieldType =
    FEEDBACK_LIST_SORT_FIELD.CREATED_AT;

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
    default: 12,
    int: true,
  })
  readonly take: number = 12;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @NumberField()
  readonly productId: number;

  @BooleanFieldOptional()
  readonly haveImage?: boolean | string;

  @NumberFieldOptional()
  readonly offset?: number;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 5,
    int: true,
  })
  readonly maxStar?: number;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 5,
    int: true,
  })
  readonly minStar?: number;
}
