import { ValueOf } from '../interfaces';

export const PAYMENT_TYPE = {
  ORDER: 'ORDER',
  SERVICE: 'SERVICE',
} as const;

export type PaymentTypeType = ValueOf<typeof PAYMENT_TYPE>;
