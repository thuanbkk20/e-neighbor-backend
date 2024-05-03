import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { ORDER_STATUS } from '@/constants';
import { CreateFeedbackDto } from '@/modules/feedback/domains/dtos/createFeedback.dto';
import { FeedbackDto } from '@/modules/feedback/domains/dtos/feedback.dto';
import { FeedbackPageOptionsDto } from '@/modules/feedback/domains/dtos/feedbackPageOption.dto';
import { FeedbackResponseDto } from '@/modules/feedback/domains/dtos/feedbackResponse.dto';
import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';
import { FeedbackRepository } from '@/modules/feedback/repositories/feedback.repository';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';
import { OrderService } from '@/modules/order/services/order.service';
import { ProductService } from '@/modules/product/services/product.service';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';
import { ContextProvider } from '@/providers';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  async productAverageStar(productId: number): Promise<number> {
    return this.feedbackRepository.productAverageStar(productId);
  }

  async queryFeedbackSummary(productId: number) {
    return this.feedbackRepository.productFeedbackSummary(productId);
  }

  async findFeedBackByOrderId(orderId: number): Promise<FeedbackEntity> {
    return this.feedbackRepository.findByOrderId(orderId);
  }

  async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<FeedbackDto> {
    const order = await this.orderService.findOrderEntityById(
      createFeedbackDto.orderId,
    );
    const user = ContextProvider.getAuthUser();
    // Check order status
    if (order.orderStatus != ORDER_STATUS.COMPLETED) {
      throw new BadRequestException('Order not completed!');
    }
    if (
      (user instanceof UserEntity && user.id !== order.user.id) ||
      (user instanceof LessorEntity && user.user.id !== order.user.id)
    ) {
      throw new UnauthorizedException(
        'PermissionDenied: Can not feedback order that belong to other user!',
      );
    }
    // Check if order already has feedback
    const existingFeedback = await this.findFeedBackByOrderId(
      createFeedbackDto.orderId,
    );
    if (existingFeedback != null) {
      throw new BadRequestException('Feedback already exists for this order!');
    }
    const newFeedback = new FeedbackEntity();
    newFeedback.content = createFeedbackDto.content;
    newFeedback.image = createFeedbackDto.image;
    newFeedback.star = createFeedbackDto.star;
    newFeedback.order = order;
    const returnFeedback = await this.feedbackRepository.save(newFeedback);
    // Update product average rating
    const averageStar = await this.productAverageStar(order.product.id);
    await this.productService.updateProductAverageStar(
      order.product.id,
      averageStar,
    );
    // Update order
    order.feedback = returnFeedback;
    await this.orderService.updateOrderEntity(order);
    return new FeedbackDto(returnFeedback);
  }

  async getFeedbacksList(
    pageOptionsDto: FeedbackPageOptionsDto,
  ): Promise<PageDto<FeedbackDto>> {
    const feedbackResponse: FeedbackResponseDto =
      await this.feedbackRepository.getFeedbackList(pageOptionsDto);

    const feedbackRecords = feedbackResponse.entities.map(
      (order) => new FeedbackDto(order),
    );
    const itemCount = feedbackResponse.itemCount;
    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });

    const statistic = await this.queryFeedbackSummary(pageOptionsDto.productId);

    return new PageDto(feedbackRecords, pageMeta, { statistic });
  }
}
