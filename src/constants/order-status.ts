import { type ValueOf } from './../interfaces';
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
} as const;

export type OrderStatusType = ValueOf<typeof ORDER_STATUS>;
