import { type ValueOf } from '@/interfaces';
export enum STATUS {
  AVAILABLE = 'available',
  NOT_AVAILABLE = 'not_available',
}

export type StatusType = ValueOf<typeof STATUS>;
