import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1709909837958 implements MigrationInterface {
  name = 'Migrations1709909837958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_surcharge" ALTER COLUMN "price" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_surcharge" ALTER COLUMN "price" DROP DEFAULT`,
    );
  }
}
