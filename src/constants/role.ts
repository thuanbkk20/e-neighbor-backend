import { type ValueOf } from './../interfaces';
export enum ROLE {
  USER = 'user',
  LESSOR = 'lessor',
  ADMIN = 'admin',
}

export type RoleType = ValueOf<typeof ROLE>;
