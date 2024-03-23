import { FeedbackRepository } from './../domains/repositories/feedback.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async productAverageStar(productId: number): Promise<number> {
    return this.feedbackRepository.productAverageStar(productId);
  }
}
