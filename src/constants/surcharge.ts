import { type ValueOf } from '../interfaces';
export const SURCHARGE = {
  OVERTIME: 'Phí thuê quá giờ',
  HYGIENCE: 'Phí vệ sinh',
  DAMAGE: 'Phí tổn hại sản phẩm',
};

export type SurchargeType = ValueOf<typeof SURCHARGE>;
