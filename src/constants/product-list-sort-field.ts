import { type ValueOf } from '@/interfaces';
export const PRODUCT_LIST_SORT_FIELD = {
  CREATED_AT: 'created_at',
  PRICE: 'price',
} as const;

export type ProductListSortFieldType = ValueOf<typeof PRODUCT_LIST_SORT_FIELD>;
