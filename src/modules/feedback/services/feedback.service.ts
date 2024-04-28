import { Injectable } from '@nestjs/common';

import { FeedbackRepository } from '../repositories/feedback.repository';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async productAverageStar(productId: number): Promise<number> {
    return this.feedbackRepository.productAverageStar(productId);
  }
}
