import { type ValueOf } from '@/interfaces';
export const PRODUCT_LIST_SORT_FIELD = {
  CREATED_AT: 'createdAt',
  PRICE: 'price',
  ACCESS_COUNT: 'accessCount',
} as const;

export type ProductListSortFieldType = ValueOf<typeof PRODUCT_LIST_SORT_FIELD>;
