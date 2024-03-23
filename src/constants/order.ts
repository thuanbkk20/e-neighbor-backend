import { type ValueOf } from '@/interfaces';
export const ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type OrderType = ValueOf<typeof ORDER>;
