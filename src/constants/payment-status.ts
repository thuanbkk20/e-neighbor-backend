import { ValueOf } from '@/interfaces';

export const PAYMENT_STATUS = {
  COMPLETE: 'COMPLETE',
  INCOMPLETE: 'INCOMPLETE',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatusType = ValueOf<typeof PAYMENT_STATUS>;
