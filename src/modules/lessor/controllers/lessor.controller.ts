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
import { FeedbackStatisticResponseDto } from '@/modules/lessor/domains/dtos/feedbackStatisticResponse.dto';
import { LessorOnboardDto } from '@/modules/lessor/domains/dtos/lessor-onboard.dto';
import { OverallStatisticResponseDto } from '@/modules/lessor/domains/dtos/overallStatisticResponse.dto';
import { RevenueStatisticResponseDto } from '@/modules/lessor/domains/dtos/revenueStatisticResponse.dto';
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
    type: FeedbackStatisticResponseDto,
  })
  async feedbackStatistic(
    @Query() options: StatisticOptionsDto,
    @Param('id') lessorId: number,
  ): Promise<FeedbackStatisticResponseDto> {
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
    type: RevenueStatisticResponseDto,
  })
  async revenueStatistic(
    @Query() options: StatisticOptionsDto,
    @Param('id') lessorId: number,
  ): Promise<RevenueStatisticResponseDto> {
    const result = await this.lessorService.revenueStatistic(options, lessorId);
    return result;
  }

  @Auth([ROLE.LESSOR])
  @Get('/:id/statistic/overall')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: OverallStatisticResponseDto,
  })
  async overallStatistic() {
    const result = await this.lessorService.getOverallStatistic();
    return result;
  }
}
