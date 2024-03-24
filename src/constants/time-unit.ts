import { type ValueOf } from '@/interfaces';
export const TIME_UNIT = {
  DAY: 'product.price.time.unit.day',
  WEEK: 'product.price.time.unit.week',
  MONTH: 'product.price.time.unit.month',
} as const;

export type TimeUnitType = ValueOf<typeof TIME_UNIT>;
