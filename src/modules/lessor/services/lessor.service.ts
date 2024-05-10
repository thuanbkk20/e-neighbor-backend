import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';

import { ORDER, PAYMENT_STATUS, ROLE } from '@/constants';
import { FeedbackEntity } from '@/modules/feedback/domains/entities/feedback.entity';
import { FeedbackRepository } from '@/modules/feedback/repositories/feedback.repository';
import { LessorRegisterDto } from '@/modules/lessor/domains/dtos/create-lessor.dto';
import { FeedbackRecordDto } from '@/modules/lessor/domains/dtos/feedbackStatisticRecord.dto';
import { FeedbackStatisticResponseDto } from '@/modules/lessor/domains/dtos/feedbackStatisticResponse.dto';
import { LessorOnboardDto } from '@/modules/lessor/domains/dtos/lessor-onboard.dto';
import { RevenueRecordDto } from '@/modules/lessor/domains/dtos/revenueStatisticRecord.dto';
import { RevenueStatisticResponseDto } from '@/modules/lessor/domains/dtos/revenueStatisticResponse.dto';
import { StatisticOptionsDto } from '@/modules/lessor/domains/dtos/statisticOptions.dto';
import { LessorEntity } from '@/modules/lessor/domains/entities/lessor.entity';
import { LessorRepository } from '@/modules/lessor/repositories/lessor.repository';
import { OrderEntity } from '@/modules/order/domains/entities/order.entity';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
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
    @InjectRepository(OrderEntity)
    private readonly orderRepository: OrderRepository,
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
  ): Promise<FeedbackStatisticResponseDto> {
    const lessor = ContextProvider.getAuthUser();
    if (lessor.id != lessorId) {
      throw new UnauthorizedException();
    }
    const statisticData = await this.getFeedbackStatisticRawData(
      options,
      lessorId,
    );

    statisticData.chartData = await this.fillMissingDatesFeedback(
      statisticData.chartData,
      options.dayRange,
    );
    return statisticData;
  }

  private fillMissingDatesFeedback(
    result: FeedbackRecordDto[],
    dateRange: number,
  ): FeedbackRecordDto[] {
    const filledResult: FeedbackRecordDto[] = [];
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

      const formatDateString = dayjs(currentDate).format('DD/MM/YYYY');

      if (existingRecord) {
        filledResult.push({ ...existingRecord, time: formatDateString });
      } else {
        filledResult.push({
          averageStar: 0,
          totalFeedback: 0,
          time: formatDateString,
        });
      }
    }

    return filledResult;
  }

  async getFeedbackStatisticRawData(
    options: StatisticOptionsDto,
    lessorId: number,
  ): Promise<FeedbackStatisticResponseDto> {
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

    const feedbackSummarizeQuery = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.order', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.lessor', 'lessor')
      .where('lessor.id = :lessorId', { lessorId: lessorId })
      .select('AVG(feedback.star)', 'averageStar')
      .addSelect('COUNT(*)', 'totalFeedback');

    const feedbackByRatingQuery = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.order', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.lessor', 'lessor')
      .select('feedback.star', 'rating')
      .addSelect('COUNT(*)', 'numberOfFeedback')
      .groupBy('feedback.star')
      .where('lessor.id = :lessorId', { lessorId: lessorId });

    if (options.productId) {
      feedbackSummarizeQuery.andWhere('product.id = :productId', {
        productId: options.productId,
      });
      feedbackByRatingQuery.andWhere('product.id = :productId', {
        productId: options.productId,
      });
    }

    const feedbackSummarizeResult = await feedbackSummarizeQuery.getRawOne();
    const averageStar = feedbackSummarizeResult.averageStar
      ? parseFloat(feedbackSummarizeResult.averageStar)
      : 0;
    const totalFeedback = feedbackSummarizeResult.totalFeedback
      ? parseInt(feedbackSummarizeResult.totalFeedback)
      : 0;

    const feedbackByRatingResult = await feedbackByRatingQuery.getRawMany();
    const formatFeedbackByRating = [5, 4, 3, 2, 1].map((rating) => {
      const existingEntry = feedbackByRatingResult?.find(
        (entry) => entry.rating === rating,
      );
      if (existingEntry)
        return {
          ...existingEntry,
          numberOfFeedback: parseInt(existingEntry.numberOfFeedback),
        };
      return { rating, numberOfFeedback: 0 };
    });

    return {
      chartData: result,
      averageStar,
      totalFeedback,
      feedbackByRating: formatFeedbackByRating,
    };
  }

  async revenueStatistic(
    options: StatisticOptionsDto,
    lessorId: number,
  ): Promise<RevenueStatisticResponseDto> {
    const lessor = ContextProvider.getAuthUser();
    if (lessor.id != lessorId) {
      throw new UnauthorizedException();
    }
    const statisticData = await this.getRevenueStatisticRawData(
      options,
      lessorId,
    );

    statisticData.chartData = await this.fillMissingDatesRevenue(
      statisticData.chartData,
      options.dayRange,
    );
    return statisticData;
  }

  private fillMissingDatesRevenue(
    result: RevenueRecordDto[],
    dateRange: number,
  ): RevenueRecordDto[] {
    const filledResult: RevenueRecordDto[] = [];
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
          revenue: 0,
          time: currentDate,
        });
      }
    }

    return filledResult;
  }

  async getRevenueStatisticRawData(
    options: StatisticOptionsDto,
    lessorId: number,
  ): Promise<RevenueStatisticResponseDto> {
    // Query to get revenue statistics grouped by date
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.lessor', 'lessor')
      .where('lessor.id = :lessorId', { lessorId: lessorId })
      .andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: PAYMENT_STATUS.COMPLETE,
      })
      .select('SUM(order.orderValue)', 'revenue')
      .addSelect('DATE(order.createdAt)', 'time')
      .groupBy('DATE(order.createdAt)');

    // Calculate the start and end dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - options.dayRange);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    query.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    });

    if (options.productId) {
      query.andWhere('product.id = :productId', {
        productId: options.productId,
      });
    }

    query.orderBy('DATE(order.createdAt)', ORDER.ASC);
    const result = await query.getRawMany();
    result.forEach((record) => {
      record.revenue = parseInt(record.revenue);
    });

    // Query to get the total revenue
    const totalRevenueQuery = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.lessor', 'lessor')
      .where('lessor.id = :lessorId', { lessorId: lessorId })
      .andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: PAYMENT_STATUS.COMPLETE,
      })
      .select('SUM(order.orderValue)', 'totalRevenue');

    if (options.productId) {
      totalRevenueQuery.andWhere('product.id = :productId', {
        productId: options.productId,
      });
    }

    const totalRevenueResult = await totalRevenueQuery.getRawOne();
    const totalRevenue = totalRevenueResult.totalRevenue
      ? parseInt(totalRevenueResult.totalRevenue)
      : 0;

    return {
      chartData: result,
      totalRevenue: totalRevenue,
    };
  }
}
