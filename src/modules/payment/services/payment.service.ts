import { Injectable } from '@nestjs/common';

import { DuplicatePaymentMethodException } from '@/exceptions';
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
    const existingPaymentMethod =
      await this.paymentRepository.findOneByManyOptions(paymentMethod);
    if (existingPaymentMethod) {
      throw new DuplicatePaymentMethodException(
        'Payment method already exists',
      );
    }
    const paymentMethodtoAdd = {
      user: user,
      ...paymentMethod,
    };
    this.paymentRepository.insert(paymentMethodtoAdd);
    return paymentMethod;
  }

  async updateUserPaymentMethod(
    user: UserEntity,
    paymentMethods: UpdatePaymentMethodDto[],
  ) {
    const currentPaymentMethods = await this.paymentRepository.findByUserId(
      user.id,
    );
    const paymentMethodsToSave = paymentMethods.map((paymentMethod) => ({
      name: paymentMethod.name,
      type: paymentMethod.type,
      accountNumber: paymentMethod.accountNumber,
      user: user,
    }));

    const currentMethodIds = currentPaymentMethods.map(
      (method) => `${method.type}-${method.name}-${method.accountNumber}`,
    );
    const newMethodIds = paymentMethodsToSave.map(
      (method) => `${method.type}-${method.name}-${method.accountNumber}`,
    );

    const newPaymentMethods = paymentMethodsToSave.filter(
      (newMethod) =>
        !currentMethodIds.includes(
          `${newMethod.type}-${newMethod.name}-${newMethod.accountNumber}`,
        ),
    );
    if (newPaymentMethods.length != 0) {
      await this.paymentRepository.insert(newPaymentMethods);
    }
    const oldPaymentMethods = currentPaymentMethods.filter(
      (currentMethod) =>
        !newMethodIds.includes(
          `${currentMethod.type}-${currentMethod.name}-${currentMethod.accountNumber}`,
        ),
    );
    if (oldPaymentMethods.length != 0) {
      const oldPaymentMethodIds = oldPaymentMethods.map((method) => method.id);
      await this.paymentRepository.update(oldPaymentMethodIds, {
        isInUsed: false,
      });
    }

    return this.findByUserId(user.id);
  }
}
