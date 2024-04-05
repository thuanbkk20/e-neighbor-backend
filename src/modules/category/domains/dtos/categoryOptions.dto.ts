import { NumberFieldOptional } from '@/decorators';

export class CategoryOptionsDto {
  @NumberFieldOptional()
  readonly isVehicle?: boolean;
}
