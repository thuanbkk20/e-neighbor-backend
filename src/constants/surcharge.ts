import { type ValueOf } from '@/interfaces';
export const SURCHARGE = {
  LATE_FEE: 'products.surCharge.lateFees',
  SANITY_FEE: 'products.surCharge.sanityFees',
  DAMAGE_FEE: 'products.surCharge.damageFees',
};

export type SurchargeType = ValueOf<typeof SURCHARGE>;
