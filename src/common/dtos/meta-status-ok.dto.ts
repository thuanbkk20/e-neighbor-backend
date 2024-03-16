import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaStatusOkDto {
  @ApiProperty({ example: HttpStatus.OK })
  statusCode: number;

  @ApiPropertyOptional({ example: '' })
  message: string;

  @ApiPropertyOptional({ example: '' })
  error: string;
}
