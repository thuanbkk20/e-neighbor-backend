import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserNotFoundException } from 'src/exceptions';
import { UserEntity } from '../domains/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneByUserName(userName: string): Promise<UserEntity> {
    const user = await this.userRepository.findUserByUserName(userName);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findOneById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      id: id,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
