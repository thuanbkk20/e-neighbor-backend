import { type ValueOf } from '../interfaces';

export const REQUIRED_DOCUMENTS = {
  NONE: 'NONE',
  OPTION1: 'OPTION1',
  OPTION2: 'OPTION2',
} as const;

export const REQUIRED_DOCUMENTS_MAPPING = {
  NONE: 'Không yêu cầu',
  OPTION1: 'GPLX & CCCD gắn chip (đối chiếu)',
  OPTION2: 'GPLX (đối chiếu) & Passport (giữ lại)',
} as const;

export type RequiredDocumentsType = ValueOf<typeof REQUIRED_DOCUMENTS>;
export type RequiredDocumentsMappingType = ValueOf<
  typeof REQUIRED_DOCUMENTS_MAPPING
>;
