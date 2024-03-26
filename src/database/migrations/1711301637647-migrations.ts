import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1711301637647 implements MigrationInterface {
  name = 'Migrations1711301637647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "access_count" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "rating" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."products_status_enum" RENAME TO "products_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_status_enum" AS ENUM('product.status.available', 'product.status.not.available')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "status" TYPE "public"."products_status_enum" USING "status"::"text"::"public"."products_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'product.status.available'`,
    );
    await queryRunner.query(`DROP TYPE "public"."products_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."products_time_unit_enum" RENAME TO "products_time_unit_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_time_unit_enum" AS ENUM('product.price.time.unit.day', 'product.price.time.unit.week', 'product.price.time.unit.month')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "time_unit" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "time_unit" TYPE "public"."products_time_unit_enum" USING "time_unit"::"text"::"public"."products_time_unit_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "time_unit" SET DEFAULT 'product.price.time.unit.day'`,
    );
    await queryRunner.query(`DROP TYPE "public"."products_time_unit_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."products_time_unit_enum_old" AS ENUM('DAY', 'MONTH')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "time_unit" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "time_unit" TYPE "public"."products_time_unit_enum_old" USING "time_unit"::"text"::"public"."products_time_unit_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "time_unit" SET DEFAULT 'DAY'`,
    );
    await queryRunner.query(`DROP TYPE "public"."products_time_unit_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."products_time_unit_enum_old" RENAME TO "products_time_unit_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_status_enum_old" AS ENUM('available', 'not_available')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "status" TYPE "public"."products_status_enum_old" USING "status"::"text"::"public"."products_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'available'`,
    );
    await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."products_status_enum_old" RENAME TO "products_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "access_count"`,
    );
  }
}
