import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { CreateFeedbackDto } from '@/modules/feedback/domains/dtos/createFeedback.dto';
import { FeedbackDto } from '@/modules/feedback/domains/dtos/feedback.dto';
import { FeedbackService } from '@/modules/feedback/services/feedback.service';

@Controller('feedbacks')
@ApiTags('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Auth([ROLE.USER, ROLE.LESSOR])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: FeedbackDto })
  @ApiBody({ type: CreateFeedbackDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<FeedbackDto> {
    console.log('aaaa');
    return this.feedbackService.createFeedback(createFeedbackDto);
  }
}
