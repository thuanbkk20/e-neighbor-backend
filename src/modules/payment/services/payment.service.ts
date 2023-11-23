import { Injectable } from '@nestjs/common';
import { PaymentMethodEntity } from '../domains/entities/payment.entity';
import { PaymentRepository } from './../repositories/payment.repository';
import { AddPaymentMethodDto } from '../domains/dtos/add-payment-method.dto';
import { UserEntity } from '../../user/domains/entities/user.entity';
@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async findByUserId(id: number): Promise<PaymentMethodEntity[]> {
    const paymentMethods = await this.paymentRepository.findByUserId(id);
    return paymentMethods;
  }

  async addUserPaymentMethod(
    paymentMethod: AddPaymentMethodDto,
    user: UserEntity,
  ): Promise<AddPaymentMethodDto> {
    const paymentMethodtoAdd = {
      name: paymentMethod.name,
      type: paymentMethod.type,
      accountNumber: paymentMethod.accountNumber,
      user: user,
    };
    this.paymentRepository.insert(paymentMethodtoAdd);
    return paymentMethod;
  }
}
