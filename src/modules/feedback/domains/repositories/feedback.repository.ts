import { DataSource, Repository } from 'typeorm';
import { FeedbackEntity } from '../entities/feedback.entity';
import { Injectable } from '@nestjs/common';

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
}
