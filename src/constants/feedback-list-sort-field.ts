import { type ValueOf } from '@/interfaces';
export const FEEDBACK_LIST_SORT_FIELD = {
  CREATED_AT: 'createdAt',
  STAR: 'star',
} as const;

export type FeedbackListSortFieldType = ValueOf<
  typeof FEEDBACK_LIST_SORT_FIELD
>;
