import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { ROLE } from '@/constants';
import { Auth } from '@/decorators';
import { LessorRegisterDto } from '@/modules/lessor/domains/dtos/create-lessor.dto';
import { LessorService } from '@/modules/lessor/services/lessor.service';

@ApiTags('lessor')
@Controller('lessor')
export class LessorController {
  constructor(private readonly lessorService: LessorService) {}

  @Auth([ROLE.USER, ROLE.ADMIN])
  @Post()
  @ApiBody({ type: LessorRegisterDto })
  async register(@Body() registerDto: LessorRegisterDto) {
    return this.lessorService.registerLessor(registerDto);
  }
}
