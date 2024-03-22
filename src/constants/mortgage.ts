import { type ValueOf } from '@/interfaces';
export const MORTGAGE = {
  NONE: 'NONE',
  OPTION1: 'OPTION1',
} as const;

export const MORTGAGE_MAPPING = {
  NONE: 'Không yêu cầu',
  OPTION1:
    '15 triệu (tiền mặt/chuyển khoản cho chủ khi nhận xe) hoặc Xe máy (kèm cà vẹt gốc) giá trị 15 triệu',
};

export type MortgageType = ValueOf<typeof MORTGAGE>;
export type MortgageMappingType = ValueOf<typeof MORTGAGE_MAPPING>;
