import { IsNumber } from 'class-validator';

import { NumberField } from '@/decorators';
import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';

export class FeedbackResponseDto {
  entities: FeedbackEntity[];

  @NumberField()
  @IsNumber()
  itemCount: number;

  constructor(entities: FeedbackEntity[], itemCount: number) {
    this.entities = entities;
    this.itemCount = itemCount;
  }
}
