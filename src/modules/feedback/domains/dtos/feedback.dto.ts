import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';

export class FeedbackDto {
  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiProperty()
  star: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  uploaderFullName: string;

  @ApiProperty()
  uploaderAvatar: string;

  constructor(feedbackEntity: FeedbackEntity) {
    this.content = feedbackEntity.content;
    this.image = feedbackEntity.image;
    this.star = feedbackEntity.star;
    this.orderId = feedbackEntity.order.id;
    this.productId = feedbackEntity.order.product.id;
    this.uploaderFullName = feedbackEntity.order.user.fullName;
    this.uploaderAvatar = feedbackEntity.order.user.avatar;
  }
}
