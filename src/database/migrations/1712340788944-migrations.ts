import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1712340788944 implements MigrationInterface {
  name = 'Migrations1712340788944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cccd"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "citizen_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "citizen_card_front" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "citizen_card_back" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessors" ADD "shop_name" character varying DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD "is_in_used" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD "characteristics" text NOT NULL DEFAULT '[]'`,
    );
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
    await queryRunner.query(
      `ALTER TABLE "category" DROP COLUMN "characteristics"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP COLUMN "is_in_used"`,
    );
    await queryRunner.query(`ALTER TABLE "lessors" DROP COLUMN "shop_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "citizen_card_back"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "citizen_card_front"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "citizen_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "cccd" character varying`);
  }
}
