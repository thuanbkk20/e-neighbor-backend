import { NotFoundException } from '@nestjs/common';

import { ERROR_ADMIN_NOT_FOUND } from '@/filters/constraint-errors';

export class AdminNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super(ERROR_ADMIN_NOT_FOUND, error);
  }
}
