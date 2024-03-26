import { ORDER, OrderType } from '@/constants';
import {
  PRODUCT_LIST_SORT_FIELD,
  ProductListSortFieldType,
} from '@/constants/product-list-sort-field';
import { STATUS, StatusType } from '@/constants/status';
import {
  BooleanField,
  BooleanFieldOptional,
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '@/decorators';

export class ProductPageOptionsDto {
  @EnumFieldOptional(() => PRODUCT_LIST_SORT_FIELD, {
    default: PRODUCT_LIST_SORT_FIELD.CREATED_AT,
  })
  readonly sortField: ProductListSortFieldType =
    PRODUCT_LIST_SORT_FIELD.CREATED_AT;

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

  @BooleanField()
  readonly isConfirmedByAdmin: boolean;

  @StringFieldOptional()
  readonly name?: string;

  @NumberFieldOptional()
  readonly categoryId?: number;

  @BooleanFieldOptional()
  readonly isVehicle?: boolean;

  @NumberFieldOptional()
  readonly lessorId?: number;

  @EnumFieldOptional(() => STATUS)
  readonly status?: StatusType[];

  @NumberFieldOptional()
  readonly offset?: number;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 5,
    int: true,
  })
  readonly rating?: number;

  @NumberFieldOptional({
    minimum: 0,
    int: true,
  })
  readonly minRentalFrequency?: number;

  @NumberFieldOptional({
    minimum: 1,
    int: true,
  })
  readonly maxRentalFrequency?: number;
}
