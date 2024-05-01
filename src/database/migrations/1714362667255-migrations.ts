import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1714362667255 implements MigrationInterface {
  name = 'Migrations1714362667255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."orders_payment_status_enum" RENAME TO "orders_payment_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_payment_status_enum" AS ENUM('COMPLETE', 'INCOMPLETE', 'REFUNDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "payment_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "payment_status" TYPE "public"."orders_payment_status_enum" USING "payment_status"::"text"::"public"."orders_payment_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DEFAULT 'INCOMPLETE'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."orders_payment_status_enum_old"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "rating" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "rating"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "rating" integer`);
    await queryRunner.query(
      `CREATE TYPE "public"."orders_payment_status_enum_old" AS ENUM('COMPLETE', 'INCOMPLETE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "payment_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "payment_status" TYPE "public"."orders_payment_status_enum_old" USING "payment_status"::"text"::"public"."orders_payment_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DEFAULT 'INCOMPLETE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."orders_payment_status_enum_old" RENAME TO "orders_payment_status_enum"`,
    );
  }
}
