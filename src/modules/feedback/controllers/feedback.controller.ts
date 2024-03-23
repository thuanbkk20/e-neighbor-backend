import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeedbackService } from '../services/feedback.service';

@Controller('feedbacks')
@ApiTags('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  async test() {
    return this.feedbackService.productAverageStar(18);
  }
}
