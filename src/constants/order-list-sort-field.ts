import { type ValueOf } from '@/interfaces';
export const ORDER_LIST_SORT_FIELD = {
  CREATED_AT: 'createdAt',
  RENT_DATE: 'rentDate',
  RETURN_DATE: 'returnDate',
  ORDER_VALUE: 'orderValue',
} as const;

export type OrderListSortFieldType = ValueOf<typeof ORDER_LIST_SORT_FIELD>;
