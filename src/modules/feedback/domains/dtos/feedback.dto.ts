import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';

export class FeedbackUserDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  avatar: string;

  constructor(user: UserEntity) {
    this.fullName = user.fullName;
    this.avatar = user.avatar;
  }
}
export class FeedbackDto {
  @ApiProperty()
  id: number;

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
  createdAt: Date;

  @ApiProperty()
  user: FeedbackUserDto;

  constructor(feedbackEntity: FeedbackEntity) {
    this.id = feedbackEntity.id;
    this.content = feedbackEntity.content;
    this.image = feedbackEntity.image;
    this.star = feedbackEntity.star;
    this.orderId = feedbackEntity.order.id;
    this.productId = feedbackEntity.order.product.id;
    this.createdAt = feedbackEntity.createdAt;
    this.user = new FeedbackUserDto(feedbackEntity.order.user);
  }
}
