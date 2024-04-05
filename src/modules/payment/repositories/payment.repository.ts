import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AddPaymentMethodDto } from '@/modules/payment/domains/dtos/payment-method.dto';
import { PaymentMethodEntity } from '@/modules/payment/domains/entities/payment-method.entity';

@Injectable()
export class PaymentRepository extends Repository<PaymentMethodEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PaymentMethodEntity, dataSource.createEntityManager());
  }

  async findByUserId(id: number): Promise<PaymentMethodEntity[]> {
    const queryRunner = this.createQueryBuilder('paymentMethod')
      .where('paymentMethod.user_id = :id', { id: id })
      .andWhere('paymentMethod.is_in_used = true');
    return queryRunner.getMany();
  }

  async deleteByIds(ids: number[]) {
    await this.createQueryBuilder('payment_method') // Use the correct table name here
      .update('paymentMethod.is_in_used = false')
      .where('payment_method.id IN (:...ids)', { ids: ids })
      .execute();
  }

  async findOneByManyOptions(
    options: AddPaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    const queryRunner = this.createQueryBuilder('paymentMethod')
      .where('paymentMethod.user_id = :id', { id: options.userId })
      .andWhere('paymentMethod.type = :type', { type: options.type })
      .andWhere('paymentMethod.name = :name', { name: options.name })
      .andWhere('paymentMethod.account_number = :accountNumber', {
        accountNumber: options.accountNumber,
      })
      .andWhere('paymentMethod.is_in_used = true');
    return queryRunner.getOne();
  }
}
