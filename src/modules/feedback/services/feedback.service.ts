import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ORDER_STATUS } from '@/constants';
import { CreateFeedbackDto } from '@/modules/feedback/domains/dtos/createFeedback.dto';
import { FeedbackDto } from '@/modules/feedback/domains/dtos/feedback.dto';
import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';
import { FeedbackRepository } from '@/modules/feedback/repositories/feedback.repository';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';
import { OrderService } from '@/modules/order/services/order.service';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';
import { ContextProvider } from '@/providers';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly orderService: OrderService,
  ) {}

  async productAverageStar(productId: number): Promise<number> {
    return this.feedbackRepository.productAverageStar(productId);
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
    return new FeedbackDto(returnFeedback);
  }
}
