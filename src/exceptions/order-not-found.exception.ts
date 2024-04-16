import { NotFoundException } from '@nestjs/common';

import { ERROR_ORDER_NOT_FOUND } from '@/filters/constraint-errors';

export class OrderNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super(ERROR_ORDER_NOT_FOUND, error);
  }
}
