import { NotFoundException } from '@nestjs/common';

import { ERROR_LESSOR_NOT_FOUND } from '../filters/constraint-errors';

export class LessorNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super(ERROR_LESSOR_NOT_FOUND, error);
  }
}
