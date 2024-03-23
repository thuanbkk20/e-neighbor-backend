import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FeedbackService } from '@/modules/feedback/services/feedback.service';

@Controller('feedbacks')
@ApiTags('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
}
