import { NumberField, NumberFieldOptional } from '@/decorators';

export class StatisticOptionsDto {
  @NumberFieldOptional({
    minimum: 1,
    int: true,
  })
  productId?: number;

  @NumberField({
    minimum: 7,
    default: 7,
    int: true,
  })
  dayRange: number;
}
