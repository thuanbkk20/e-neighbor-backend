import { type ValueOf } from '@/interfaces';
export enum STATUS {
  AVAILABLE = 'product.status.available',
  NOT_AVAILABLE = 'product.status.not.available',
}

export type StatusType = ValueOf<typeof STATUS>;
