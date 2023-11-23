import { Body, Controller, Post } from '@nestjs/common';
import { LessorService } from '../services/lessor.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../../decorators';
import { ROLE } from '../../../constants';
import { LessorRegisterDto } from '../domains/dtos/create-lessor.dto';

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
