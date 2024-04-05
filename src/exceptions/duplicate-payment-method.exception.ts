import { ConflictException } from '@nestjs/common';

import { ERROR_DUPLICATE_PAYMENT_METHOD } from '@/filters/constraint-errors';

export class DuplicatePaymentMethodException extends ConflictException {
  constructor(error?: string) {
    super(ERROR_DUPLICATE_PAYMENT_METHOD, error);
  }
}
