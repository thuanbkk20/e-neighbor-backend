import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { LessorRegisterDto } from '@/modules/lessor/domains/dtos/create-lessor.dto';
import { LessorOnboardDto } from '@/modules/lessor/domains/dtos/lessor-onboard.dto';
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
}
