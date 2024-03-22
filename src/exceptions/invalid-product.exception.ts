import { BadRequestException } from '@nestjs/common';

import { ERROR_PRODUCT_MISSING_FIELD } from '@/filters/constraint-errors';

export class ProductMissingFieldException extends BadRequestException {
  constructor(error?: string) {
    super(ERROR_PRODUCT_MISSING_FIELD, error);
  }
}
