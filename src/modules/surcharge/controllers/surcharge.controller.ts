import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SurchargeDto } from '@/modules/surcharge/domains/dtos/surcharge.dto';
import { SurchargeService } from '@/modules/surcharge/services/surcharge.service';

@Controller('surcharges')
@ApiTags('surcharges')
export class SurchargeController {
  constructor(private readonly surchargeService: SurchargeService) {}

  @Get()
  @ApiOkResponse({
    type: [SurchargeDto],
  })
  async getAllSurcharges(): Promise<SurchargeDto[]> {
    const surcharges = await this.surchargeService.getAllSurcharges();
    return surcharges.map((surcharge) => new SurchargeDto(surcharge));
  }

  @Get(':id')
  @ApiOkResponse({
    type: SurchargeDto,
  })
  async getOne(@Param('id') id: number): Promise<SurchargeDto> {
    const surcharge = await this.surchargeService.getSurchargeById(id);
    return new SurchargeDto(surcharge);
  }
}
