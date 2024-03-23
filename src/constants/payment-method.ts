import { type ValueOf } from '@/interfaces';
export const PAYMENT_METHOD = {
  BANKING: 'BANKING',
  E_WALLET: 'E WALLET',
} as const;

export type PaymentMethodType = ValueOf<typeof PAYMENT_METHOD>;
