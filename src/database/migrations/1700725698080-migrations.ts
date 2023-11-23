import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1700725698080 implements MigrationInterface {
  name = 'Migrations1700725698080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP COLUMN "account_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD "account_number" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP COLUMN "account_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD "account_number" integer NOT NULL`,
    );
  }
}
