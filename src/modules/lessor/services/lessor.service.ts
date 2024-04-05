import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ROLE } from '@/constants';
import { LessorRegisterDto } from '@/modules/lessor/domains/dtos/create-lessor.dto';
import { LessorOnboardDto } from '@/modules/lessor/domains/dtos/lessor-onboard.dto';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';
import { LessorRepository } from '@/modules/lessor/repositories/lessor.repository';
import { PaymentService } from '@/modules/payment/services/payment.service';
import { UserUpdateDto } from '@/modules/user/domains/dtos/user-update.dto';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';
import { UserService } from '@/modules/user/services/user.service';
import { ContextProvider } from '@/providers';
import { LessorNotFoundException } from 'src/exceptions';

@Injectable()
export class LessorService {
  constructor(
    private readonly lessorRepository: LessorRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly paymentService: PaymentService,
  ) {}

  async findOneById(
    id: number,
    throwException?: boolean,
  ): Promise<LessorEntity> {
    const lessor = await this.lessorRepository.findOneById(id);

    if (!lessor && throwException === true) {
      throw new LessorNotFoundException();
    }
    return lessor;
  }

  async findOneByUserId(
    id: number,
    throwException?: boolean,
  ): Promise<LessorEntity> {
    const lessor = await this.lessorRepository.findOneByUserId(id);

    if (!lessor && throwException === true) {
      throw new LessorNotFoundException();
    }
    return lessor;
  }

  async registerLessor(registerDto: LessorRegisterDto) {
    const user = await this.userService.findOneById(registerDto.userId);
    // Update user payment methods
    await this.paymentService.updateUserPaymentMethod(
      user,
      registerDto.paymentInfo,
    );
    if (user.role === ROLE.LESSOR) {
      throw new BadRequestException('The account role is already lessor');
    }
    //Update user information
    const userAfterUpdate = await this.userService.registerLessor(registerDto);
    //Create new lessor record
    const lessor = {
      wareHouseAddress: registerDto.wareHouseAddress,

      description: registerDto.description,

      shopName: registerDto.shopName,

      user: userAfterUpdate,
    };
    const newLessor = await this.lessorRepository.save(lessor);
    const payload = {
      id: newLessor.id,
      role: ROLE.LESSOR,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async lessorOnboard(registerDto: LessorOnboardDto & UserUpdateDto) {
    const authUser = ContextProvider.getAuthUser();
    // Update user payment methods
    if (authUser instanceof UserEntity) {
      await this.paymentService.updateUserPaymentMethod(
        authUser,
        registerDto.paymentInfo,
      );
    }

    const userAfterUpdate = await this.userService.updateJwtUser({
      ...registerDto,
      role: ROLE.LESSOR,
    });

    const lessor = {
      wareHouseAddress: registerDto.wareHouseAddress,

      description: registerDto.description,

      shopName: registerDto.shopName,

      user: userAfterUpdate,
    };
    const newLessor = await this.lessorRepository.save(lessor);
    const payload = {
      id: newLessor.id,
      role: ROLE.LESSOR,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
