import { ApiProperty } from '@nestjs/swagger';
import { SurchargeEntity } from '../entities/surcharge.entity';

export class SurchargeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  constructor(surcharge: SurchargeEntity) {
    this.id = surcharge.id;
    this.name = surcharge.name;
    this.description = surcharge.description;
  }
}
