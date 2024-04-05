import { BooleanFieldOptional } from '@/decorators';

export class CategoryOptionsDto {
  @BooleanFieldOptional()
  readonly isVehicle?: boolean;
}
