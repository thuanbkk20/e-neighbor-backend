import { ApiProperty } from '@nestjs/swagger';

export class DataNull {
  @ApiProperty({ default: null })
  data: string;
}
