import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Characteristics {
  @ApiProperty()
  @IsString()
  localeId: string;

  @ApiProperty()
  @IsString()
  description: string;
}
