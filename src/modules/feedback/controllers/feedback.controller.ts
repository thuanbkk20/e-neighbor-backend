import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '@/common/dtos/page.dto';
import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { CreateFeedbackDto } from '@/modules/feedback/domains/dtos/createFeedback.dto';
import { FeedbackDto } from '@/modules/feedback/domains/dtos/feedback.dto';
import { FeedbackListOkResponse } from '@/modules/feedback/domains/dtos/feedbackListOkResponse.dto';
import { FeedbackPageOptionsDto } from '@/modules/feedback/domains/dtos/feedbackPageOption.dto';
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
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: FeedbackListOkResponse,
  })
  async getProductsList(
    @Query() feedbackPageOptions: FeedbackPageOptionsDto,
  ): Promise<PageDto<FeedbackDto>> {
    return this.feedbackService.getFeedbacksList(feedbackPageOptions);
  }
}
