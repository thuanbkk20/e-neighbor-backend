import type { PipeTransform } from '@nestjs/common';
import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UnauthorizedResponseDto } from '@/common/dtos/unauthorized-response.dto';
import { ROLE } from '@/constants';
import { AuthGuard, RolesGuard } from '@/guards';
import { AuthUserInterceptor } from '@/interceptors/auth-user-interceptor.service';

export function Auth(roles: ROLE[] = []): MethodDecorator {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: UnauthorizedResponseDto,
    }),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
