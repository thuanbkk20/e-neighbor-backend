import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';
import { UserUpdateDto } from '@/modules/user/domains/dtos/user-update.dto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findUserByUserName(userName: string): Promise<UserEntity | null> {
    return this.findOneBy({
      userName: userName,
    });
  }

  async updateUser(user: UserUpdateDto): Promise<UserEntity | null> {
    return this.save(user);
  }
}
