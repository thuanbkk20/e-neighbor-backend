import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '@/modules/user/domains/entities/user.entity';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  detailedAddress?: string;

  @ApiProperty()
  dob?: Date;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  role?: string;

  @ApiProperty()
  citizenId?: string;

  @ApiProperty()
  citizenCardFront?: string;

  @ApiProperty()
  citizenCardBack?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.userName = user.userName;
    this.email = user.email;
    this.avatar = user.avatar;
    this.address = user.address;
    this.detailedAddress = user.detailedAddress;
    this.dob = user.dob;
    this.phoneNumber = user.phoneNumber;
    this.fullName = user.fullName;
    this.role = user.role;
    this.citizenId = user.citizenId;
    this.citizenCardFront = user.citizenCardFront;
    this.citizenCardBack = user.citizenCardBack;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
