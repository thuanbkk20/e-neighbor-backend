import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713277526835 implements MigrationInterface {
  name = 'Migrations1713277526835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "reject_reason" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."orders_order_status_enum" RENAME TO "orders_order_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_order_status_enum" AS ENUM('PENDING', 'APPROVED', 'IN PROGRESS', 'COMPLETED', 'CANCELED', 'REJECTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "order_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "order_status" TYPE "public"."orders_order_status_enum" USING "order_status"::"text"::"public"."orders_order_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."orders_order_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_order_status_enum_old" AS ENUM('PENDING', 'APPROVED', 'IN PROGRESS', 'COMPLETED', 'CANCELED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "order_status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "order_status" TYPE "public"."orders_order_status_enum_old" USING "order_status"::"text"::"public"."orders_order_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."orders_order_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."orders_order_status_enum_old" RENAME TO "orders_order_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "reject_reason"`);
  }
}
