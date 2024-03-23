import * as bcrypt from 'bcrypt';
import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

// import type { NotificationActionType } from '../constants';
import type { PageCursorDto } from './dtos/page-cursor.dto';

import { ORDER } from '@/constants';
// import type { NotificationType } from '../interfaces/INotificationTypes';
// import type { NotificationPayloadDto } from '../modules/notification/domains/dtos/notification-payload.dto';
// import type { NotificationTemplate } from '../modules/notification/domains/entities/notification-template.entity';
// import type { INotificationReceiver } from '../modules/notification/services/notification.service';
// import { ParseTemplatePipe } from '../pipes/parse-notification-template.pipe';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(getVar: () => TResult): string {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts[memberParts.length - 1];
}

export function sortAndPaginate<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  tableAlias: string,
  { sort, cursor, take }: PageCursorDto,
): SelectQueryBuilder<T> {
  if (cursor) {
    const compare = sort === ORDER.ASC ? '>=' : '<=';
    query = query.andWhere(`${tableAlias}.id ${compare} :cursor`, {
      cursor,
    });
  }

  query = query.orderBy(tableAlias + '.created_at', sort).limit(take + 1);

  return query;
}

// function camelCaseToSnakeCase(str: string): string {
//   return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
// }

// export function toSnakeCase(obj: NotificationPayloadDto) {
//   const snakeCaseObj = {} as Record<string, unknown>;

//   for (const [key, value] of Object.entries(obj)) {
//     snakeCaseObj[camelCaseToSnakeCase(key)] = value;
//   }

//   return snakeCaseObj;
// }

// /**
//  * This function is used to parse the current data with the template retrieved from database
//  * The template contents is expected to contain valid keys that can be parsed
//  * - The format of the key is `{{key}}`
//  * @param parseTemplate - template to parse
//  * @param notificationTemplate - template from database
//  */
// export function parse(
//   parseTemplate: NotificationType,
//   notificationTemplate: NotificationTemplate,
//   receiver: INotificationReceiver,
//   type: NotificationActionType,
// ): NotificationPayloadDto {
//   return new ParseTemplatePipe().transform([
//     parseTemplate,
//     notificationTemplate,
//     receiver,
//     type,
//   ]);
// }
