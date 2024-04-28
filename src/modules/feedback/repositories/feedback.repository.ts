import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';

@Injectable()
export class FeedbackRepository extends Repository<FeedbackEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FeedbackEntity, dataSource.createEntityManager());
  }

  async productAverageStar(productId: number): Promise<number> {
    const feedbacks = await this.createQueryBuilder('feedbacks')
      .leftJoin('feedbacks.order', 'order')
      .leftJoin('order.product', 'product')
      .select('AVG(feedbacks.star)', 'averageStar') // Calculate average using AVG function
      .where('product.id = :id', { id: productId })
      .getRawOne();

    return parseFloat(feedbacks.averageStar) || 0;
  }

  async findByOrderId(orderId: number): Promise<FeedbackEntity> {
    const feedback = await this.createQueryBuilder('feedbacks')
      .leftJoin('feedbacks.order', 'order')
      .leftJoin('order.product', 'product')
      .where('order.id = :orderId', { orderId: orderId })
      .getOne();
    return feedback;
  }
}
