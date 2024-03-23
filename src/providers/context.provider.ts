import { getValue, setValue } from 'express-ctx';

import type { AdminEntity } from '@/modules/admin/domains/entities/admin.entity';
import type { UserEntity } from '@/modules/user/domains/entities/user.entity';
import { LessorEntity } from 'src/modules/lessor/domains/entities/lessor.entity';

export class ContextProvider {
  private static readonly nameSpace = 'request';

  private static readonly authUserKey = 'user_key';

  private static get<T>(key: string): T | undefined {
    return getValue<T>(ContextProvider.getKeyWithNamespace(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static set(key: string, value: any): void {
    setValue(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setAuthUser(user: UserEntity | AdminEntity | LessorEntity): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static getAuthUser(): UserEntity | AdminEntity | LessorEntity | undefined {
    return ContextProvider.get<UserEntity | AdminEntity | LessorEntity>(
      ContextProvider.authUserKey,
    );
  }
}
