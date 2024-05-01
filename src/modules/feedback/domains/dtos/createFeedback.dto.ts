import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty()
  @IsInt()
  orderId: number;

  @ApiProperty({ default: '' })
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    type: Number,
    description: 'Star rating of the item',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt({ message: 'Star rating must be an integer' })
  @Min(1, { message: 'Star rating must be at least 1' })
  @Max(5, { message: 'Star rating must be at most 5' })
  star: number;
}
