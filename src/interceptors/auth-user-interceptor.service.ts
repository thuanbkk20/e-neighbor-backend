import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import type { AdminEntity } from '@/modules/admin/domains/entities/admin.entity';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';
import type { UserEntity } from '@/modules/user/domains/entities/user.entity';
import { ContextProvider } from '@/providers';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const user = <AdminEntity | UserEntity | LessorEntity>request.user;
    ContextProvider.setAuthUser(user);
    return next.handle();
  }
}
