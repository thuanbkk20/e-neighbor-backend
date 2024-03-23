import { ORDER_STATUS, OrderStatusType } from '@/constants';

export class FilterProductByOrderOptions {
  status: OrderStatusType = ORDER_STATUS.COMPLETED;

  minRentalFrequency?: number;

  maxRentalFrequency?: number;
}
