import { type ValueOf } from '@/interfaces';
export const RENTAL_FEE_NAME = {
  STANDARD: 'product.fee.standard',
  LATE_FEE: 'products.surCharge.lateFees',
  SANITY_FEE: 'products.surCharge.sanityFees',
  DAMAGE_FEE: 'products.surCharge.damageFees',
};

export type RentalFeeNameType = ValueOf<typeof RENTAL_FEE_NAME>;
