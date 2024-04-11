import { type ValueOf } from '@/interfaces';
export const MORTGAGE = {
  NONE: 'product.mortgage.none',
  OPTION1: 'product.mortgage.motorbike.deposite',
} as const;

export type MortgageType = ValueOf<typeof MORTGAGE>;
