import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1712078658763 implements MigrationInterface {
  name = 'Migrations1712078658763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "access_count" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "rating" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "rating" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "access_count" DROP DEFAULT`,
    );
  }
}
