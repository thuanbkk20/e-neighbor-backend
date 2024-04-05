import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1712306253287 implements MigrationInterface {
  name = 'Migrations1712306253287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD "is_in_used" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP COLUMN "is_in_used"`,
    );
  }
}
