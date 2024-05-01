import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FeedbackPageOptionsDto } from '@/modules/feedback/domains/dtos/feedbackPageOption.dto';
import { FeedbackResponseDto } from '@/modules/feedback/domains/dtos/feedbackResponse.dto';
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
      .leftJoinAndSelect('feedbacks.order', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .where('order.id = :orderId', { orderId: orderId })
      .getOne();
    return feedback;
  }

  async getFeedbackList(
    pageOptionsDto: FeedbackPageOptionsDto,
  ): Promise<FeedbackResponseDto> {
    const queryBuilder = this.createQueryBuilder('feedbacks')
      .leftJoinAndSelect('feedbacks.order', 'order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.product', 'product')
      .where('product.id = :productId', {
        productId: pageOptionsDto.productId,
      });
    // handle filter
    if (
      pageOptionsDto.haveImage == true ||
      pageOptionsDto.haveImage == 'true'
    ) {
      queryBuilder.andWhere('feedbacks.image IS NOT NULL');
    } else if (
      pageOptionsDto.haveImage == false ||
      pageOptionsDto.haveImage == 'false'
    ) {
      queryBuilder.andWhere('feedbacks.image IS NULL');
    }
    if (pageOptionsDto.minStar) {
      queryBuilder.andWhere('feedbacks.star >= :minStar', {
        minStar: pageOptionsDto.minStar,
      });
    }
    if (pageOptionsDto.maxStar) {
      queryBuilder.andWhere('feedbacks.star <= :maxStar', {
        maxStar: pageOptionsDto.maxStar,
      });
    }
    // handle sort
    if (pageOptionsDto.sortField) {
      queryBuilder
        .orderBy('feedbacks.' + pageOptionsDto.sortField, pageOptionsDto.order)
        .addOrderBy('feedbacks.id', 'DESC');
    } else {
      queryBuilder.orderBy('feedbacks.id', 'DESC');
    }

    const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    // Handle paging
    queryBuilder.skip(skip).take(pageOptionsDto.take);

    // Retrieve entities
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    return new FeedbackResponseDto(entities, itemCount);
  }
}
