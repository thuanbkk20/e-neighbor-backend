import { NotFoundException } from '@nestjs/common';

import { ERROR_PRODUCT_NOT_FOUND } from '../filters/constraint-errors';

export class ProductNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super(ERROR_PRODUCT_NOT_FOUND, error);
  }
}
