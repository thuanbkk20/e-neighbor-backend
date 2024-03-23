import { Injectable } from '@nestjs/common';

import {
  AddPaymentMethodDto,
  UpdatePaymentMethodDto,
} from '@/modules/payment/domains/dtos/payment-method.dto';
import { PaymentMethodEntity } from '@/modules/payment/domains/entities/payment-method.entity';
import { PaymentRepository } from '@/modules/payment/repositories/payment.repository';
import { UserEntity } from '@/modules/user/domains/entities/user.entity';
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

  async updateUserPaymentMethod(
    user: UserEntity,
    paymentMethods: UpdatePaymentMethodDto[],
  ) {
    //Remove user exist payment method
    await this.paymentRepository.deleteByUserId(user.id);
    //Insert the replacement payment methods
    const paymentMethodsToSave = paymentMethods.map((paymentMethod) => ({
      name: paymentMethod.name,
      type: paymentMethod.type,
      accountNumber: paymentMethod.accountNumber,
      user: user,
    }));
    this.paymentRepository.insert(paymentMethodsToSave);
  }
}
