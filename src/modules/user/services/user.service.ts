import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserNotFoundException } from 'src/exceptions';
import { UserEntity } from '../domains/entities/user.entity';
import { RegisterDto } from 'src/modules/auth/domains/dtos/sign-in.dto';
import { generateHash } from '@/common/utils';
import { GoogleSignInDto } from './../../auth/domains/dtos/google-sign-in.dto';
import { UserUpdateDto } from '../domains/dtos/user-update.dto';
import { validateHash } from './../../../common/utils';
import { UserDto } from '../domains/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(readonly userRepository: UserRepository) {}

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

  async createUser(registerDto: RegisterDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.insert({
        ...registerDto,
        password: generateHash(registerDto.password),
      });

      return user.raw[0];
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async registerByGoogle(registerDto: GoogleSignInDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.insert({
        ...registerDto,
        password: generateHash(registerDto.password),
      });

      return user.raw[0];
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByRequiredInfo(findOptions: object): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy(findOptions);
  }

  async updateUser(user: UserUpdateDto): Promise<UserDto> {
    const userInDB = await this.findOneById(user.id);
    console.log(userInDB);
    const isPasswordMatched = await validateHash(
      user.password,
      userInDB.password,
    );
    console.log(isPasswordMatched);
    if (!isPasswordMatched) {
      throw new UnauthorizedException();
    }
    user.password = generateHash(user.password);
    const { password, ...returnUser } =
      await this.userRepository.updateUser(user);
    return returnUser;
  }
}
