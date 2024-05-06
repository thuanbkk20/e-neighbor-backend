import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { ORDER, ROLE } from '@/constants';
import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';
import { FeedbackRepository } from '@/modules/feedback/repositories/feedback.repository';
import { LessorRegisterDto } from '@/modules/lessor/domains/dtos/create-lessor.dto';
import { FeedbackRecordDto } from '@/modules/lessor/domains/dtos/feedbackStatisticRecord.dto';
import { LessorOnboardDto } from '@/modules/lessor/domains/dtos/lessor-onboard.dto';
import { StatisticOptionsDto } from '@/modules/lessor/domains/dtos/statisticOptions.dto';
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
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: FeedbackRepository,
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

      location: registerDto.location,

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

      location: registerDto.location,

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

  async feedbackStatistic(
    options: StatisticOptionsDto,
    lessorId: number,
  ): Promise<FeedbackRecordDto[]> {
    const lessor = ContextProvider.getAuthUser();
    if (lessor.id != lessorId) {
      throw new UnauthorizedException();
    }
    const rawData = await this.getFeedbackStatisticRawData(options, lessorId);

    const result = await this.fillMissingDates(rawData, options.dayRange);
    return result;
  }

  private fillMissingDates(
    result: FeedbackRecordDto[],
    dateRange: number,
  ): FeedbackRecordDto[] {
    const filledResult: any[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    for (let i = 1; i <= dateRange; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      currentDate.setHours(0, 0, 0, 0);

      const existingRecord = result.find(
        (record) =>
          new Date(record.time).setHours(0, 0, 0, 0) === currentDate.getTime(),
      );

      if (existingRecord) {
        filledResult.push(existingRecord);
      } else {
        filledResult.push({
          averageStar: 0,
          totalFeedback: 0,
          time: currentDate.toISOString(),
        });
      }
    }

    return filledResult;
  }

  async getFeedbackStatisticRawData(
    options: StatisticOptionsDto,
    lessorId: number,
  ): Promise<FeedbackRecordDto[]> {
    const query = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.order', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.lessor', 'lessor')
      .where('lessor.id = :lessorId', { lessorId: lessorId })
      .select('AVG(feedback.star)', 'averageStar')
      .addSelect('COUNT(*)', 'totalFeedback')
      .addSelect('DATE(feedback.createdAt)', 'time')
      .groupBy('DATE(feedback.createdAt)');
    // Calculate the start and end dates
    const endDate = new Date();
    const startDate = new Date();
    // startDate.setDate(endDate.getDate() - options.dayRange);
    startDate.setDate(endDate.getDate() - options.dayRange);

    // Ensure the start and end dates are set to the start of the day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    query.andWhere('feedback.createdAt BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    });
    if (options.productId) {
      query.andWhere('product.id = :productId', {
        productId: options.productId,
      });
    }
    //
    query.orderBy('DATE(feedback.createdAt)', ORDER.ASC);
    const result = await query.getRawMany();
    result.forEach((record) => {
      record.averageStar = parseFloat(record.averageStar);
      record.totalFeedback = parseInt(record.totalFeedback);
    });
    return result;
  }

  async revenueStatistic(options: StatisticOptionsDto, lessorId: number) {
    if (
      options.dayRange &&
      (typeof options.dayRange !== 'number' || options.dayRange <= 7)
    ) {
      throw new BadRequestException();
    }
  }
}
