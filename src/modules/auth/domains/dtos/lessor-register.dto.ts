import { ApiProperty } from '@nestjs/swagger';

export class LessorRegisterDto {
  @ApiProperty()
  wareHouseAddress: string;

  @ApiProperty()
  wareHouseAddressDetail: string;
}
