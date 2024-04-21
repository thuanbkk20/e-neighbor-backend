import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713460472117 implements MigrationInterface {
  name = 'Migrations1713460472117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "delivery_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "delivery_address" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "delivery_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "delivery_address" text NOT NULL`,
    );
  }
}
