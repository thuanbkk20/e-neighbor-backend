import { Module } from '@nestjs/common';

import { FeedbackController } from './controllers/feedback.controller';
import { FeedbackRepository } from './domains/repositories/feedback.repository';
import { FeedbackService } from './services/feedback.service';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackRepository, FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
