import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1710512899645 implements MigrationInterface {
  name = 'Migrations1710512899645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "reject_reason" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "reject_reason"`,
    );
  }
}
