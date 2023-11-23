import { PaymentService } from './../../payment/services/payment.service';
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
import { PaymentMethodEntity } from '../../payment/domains/entities/payment.entity';
import { AddPaymentMethodDto } from '../../payment/domains/dtos/add-payment-method.dto';
import { ContextProvider } from '../../../providers';
import { AdminEntity } from '../../admin/domains/entities/admin.entity';

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

  async canCreateLessorAccount(id: number): Promise<boolean> {
    const user = await this.findOneById(id);
    const { avatar, ...fieldsToCheck } = user;
    const isValid = Object.values(fieldsToCheck).every((x) => x !== null);
    console.log(isValid);
    return isValid;
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
}
