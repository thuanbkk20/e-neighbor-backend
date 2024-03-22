import { UnauthorizedException } from '@nestjs/common';

import { ERROR_OAUTH_FAILED } from '@/filters/constraint-errors';

export class OAuthException extends UnauthorizedException {
  constructor(error?: string) {
    super({
      message: ERROR_OAUTH_FAILED,
      error: error || 'OAuth login failed',
    });
  }
}
