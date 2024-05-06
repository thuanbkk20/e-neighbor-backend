import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { LessorRegisterDto } from '@/modules/lessor/domains/dtos/create-lessor.dto';
import { FeedbackRecordDto } from '@/modules/lessor/domains/dtos/feedbackStatisticRecord.dto';
import { LessorOnboardDto } from '@/modules/lessor/domains/dtos/lessor-onboard.dto';
import { RevenueRecordDto } from '@/modules/lessor/domains/dtos/revenueStatisticRecord.dto';
import { StatisticOptionsDto } from '@/modules/lessor/domains/dtos/statisticOptions.dto';
import { LessorService } from '@/modules/lessor/services/lessor.service';
import { ContextProvider } from '@/providers';

@ApiTags('lessor')
@Controller('lessor')
export class LessorController {
  constructor(private readonly lessorService: LessorService) {}

  @Auth([ROLE.USER])
  @Post('/')
  @ApiBody({ type: LessorRegisterDto })
  async register(@Body() registerDto: LessorRegisterDto) {
    return this.lessorService.registerLessor(registerDto);
  }

  @Auth([ROLE.USER])
  @Post('/onboard')
  @ApiBody({ type: LessorOnboardDto })
  async onboard(@Body() registerDto: LessorOnboardDto) {
    return await this.lessorService.lessorOnboard({
      ...ContextProvider.getAuthUser(),
      ...registerDto,
    });
  }

  @Auth([ROLE.LESSOR])
  @Get('/:id/statistic/feedback')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: String,
  })
  async feedbackStatistic(
    @Query() options: StatisticOptionsDto,
    @Param('id') lessorId: number,
  ): Promise<FeedbackRecordDto[]> {
    const result = await this.lessorService.feedbackStatistic(
      options,
      lessorId,
    );
    return result;
  }

  @Auth([ROLE.LESSOR])
  @Get('/:id/statistic/revenue')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: String,
  })
  async revenueStatistic(
    @Query() options: StatisticOptionsDto,
    @Param('id') lessorId: number,
  ): Promise<RevenueRecordDto[]> {
    const result = await this.lessorService.revenueStatistic(options, lessorId);
    return result;
  }
}
