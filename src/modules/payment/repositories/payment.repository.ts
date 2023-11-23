import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PaymentMethodEntity } from '../domains/entities/payment.entity';

@Injectable()
export class PaymentRepository extends Repository<PaymentMethodEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PaymentMethodEntity, dataSource.createEntityManager());
  }

  async findByUserId(id: number): Promise<PaymentMethodEntity[]> {
    const queryRunner = this.createQueryBuilder('paymentMethod').where(
      'paymentMethod.user_id = :id',
      { id: id },
    );
    return queryRunner.getMany();
  }

  async deleteByUserId(id: number) {
    await this.createQueryBuilder('payment_method') // Use the correct table name here
      .delete()
      .where('payment_method.user_id = :id', { id: id })
      .execute();
  }
}
