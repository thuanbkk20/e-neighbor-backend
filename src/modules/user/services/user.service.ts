import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { omit } from 'lodash';

import { generateHash, validateHash } from '@/common/utils';
import { ROLE } from '@/constants';
import { GoogleSignInDto } from '@/modules/auth/domains/dtos/google-sign-in.dto';
import { LessorRegisterDto } from '@/modules/lessor/domains/dtos/create-lessor.dto';
import {
  AddPaymentMethodDto,
  UpdatePaymentMethodDto,
} from '@/modules/payment/domains/dtos/payment-method.dto';
import { PaymentMethodEntity } from '@/modules/payment/domains/entities/payment-method.entity';
import { PaymentService } from '@/modules/payment/services/payment.service';
import { UserUpdateDto } from '@/modules/user/domains/dtos/user-update.dto';
import { UserDto } from '@/modules/user/domains/dtos/user.dto';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserNotFoundException } from 'src/exceptions';
import { RegisterDto } from 'src/modules/auth/domains/dtos/sign-in.dto';

@Injectable()
export class UserService {
  constructor(
    readonly userRepository: UserRepository,
    readonly paymentService: PaymentService,
  ) {}

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
    const isPasswordMatched = await validateHash(
      user.password,
      userInDB.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException();
    }
    user.password = generateHash(user.password);

    const queryResult = await this.userRepository.updateUser(user);
    return omit(queryResult, ['password']);
  }

  async updateJwtUser(user: UserUpdateDto): Promise<UserDto> {
    const queryResult = await this.userRepository.updateUser(user);
    return omit(queryResult, ['password']);
  }

  async getUserPaymentInfo(userId: number): Promise<PaymentMethodEntity[]> {
    //Check if userId valid
    await this.findOneById(userId);
    return this.paymentService.findByUserId(userId);
  }

  //TODO: Prevent user from adding payment methods of another account
  async addPaymentMethod(paymentMethod: AddPaymentMethodDto) {
    const user = await this.findOneById(paymentMethod.userId);
    return this.paymentService.addUserPaymentMethod(paymentMethod, user);
  }

  async updatePaymentMethod(
    userId: number,
    paymentMethods: UpdatePaymentMethodDto[],
  ) {
    const user = await this.findOneById(userId);
    this.paymentService.updateUserPaymentMethod(user, paymentMethods);
  }

  async registerLessor(registerDto: LessorRegisterDto): Promise<UserEntity> {
    const userToUpdate = {
      ...registerDto,
      id: registerDto.userId,
      role: ROLE.LESSOR,
    };
    //update payment method
    await this.updatePaymentMethod(registerDto.userId, registerDto.paymentInfo);
    //update user infor
    return this.userRepository.save(userToUpdate);
  }
}
