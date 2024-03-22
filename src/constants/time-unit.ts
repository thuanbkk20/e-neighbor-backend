import { type ValueOf } from '@/interfaces';
export const TIME_UNIT = {
  DAY: 'DAY',
  MONTH: 'MONTH',
} as const;

export type TimeUnitType = ValueOf<typeof TIME_UNIT>;
