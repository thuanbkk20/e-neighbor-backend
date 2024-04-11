import { type ValueOf } from '@/interfaces';

export const REQUIRED_DOCUMENTS = {
  NONE: 'product.reqDocs.none',
  OPTION1: 'product.reqDocs.need.citizenCard.with.driverLicense',
  OPTION2: 'product.reqDocs.keep.passport',
} as const;

export type RequiredDocumentsType = ValueOf<typeof REQUIRED_DOCUMENTS>;
