import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DataNull } from './null-data.dto';

class UnauthorizedMetaResponseDto {
  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  statusCode: number;

  @ApiPropertyOptional({ example: 'Unauthorized' })
  message: string;

  @ApiPropertyOptional({ example: 'USER_002' })
  error: string;
}

export class UnauthorizedResponseDto {
  @ApiProperty({
    type: UnauthorizedMetaResponseDto,
  })
  meta: UnauthorizedMetaResponseDto;

  @ApiProperty({ type: DataNull })
  result: DataNull;
}
