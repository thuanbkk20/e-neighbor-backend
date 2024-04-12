import { type ValueOf } from '@/interfaces';
export const COMMON_LOCATION = {
  HCM: 'common.location.HCM',
  HN: 'common.location.HN',
} as const;

export type CommonLocationType = ValueOf<typeof COMMON_LOCATION>;
