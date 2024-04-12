import { type ValueOf } from '@/interfaces';
export const POLICY = {
  CORRECT_PURPOSE: 'product.policies.correctPurpose',
  NOT_ILLEGAL_PURPOSE: 'product.policies.not.illegalPurpose',
  NOT_PAWN_SHOP: 'product.policies.not.pawnShop',
  NOT_CAR_DIRTY: 'product.policies.carDirty',
  NOT_DELIVER_PROHIBITED: 'product.policies.not.deliver.prohibited',
  CAR_DIRTY_HANDOVER: 'product.policies.carDirty.handOver',
  NOT_FURN_DIRTY: 'product.policies.furnDirty',
  FURN_DIRTY_HANDOVER: 'product.policies.furnDirty.handOver',
};

export type PolicyType = ValueOf<typeof POLICY>;
