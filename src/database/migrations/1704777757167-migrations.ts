import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1704777757167 implements MigrationInterface {
  name = 'Migrations1704777757167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "is_vehicle" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "images" text NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_required_documents_enum" AS ENUM('NONE', 'OPTION1', 'OPTION2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "required_documents" "public"."products_required_documents_enum" NOT NULL DEFAULT 'NONE'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_time_unit_enum" AS ENUM('DAY', 'MONTH')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "time_unit" "public"."products_time_unit_enum" NOT NULL DEFAULT 'DAY'`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "category_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_9a5f6868c96e0069e699f33e124" UNIQUE ("category_id")`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "mortgage"`);
    await queryRunner.query(
      `CREATE TYPE "public"."products_mortgage_enum" AS ENUM('NONE', 'OPTION1')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "mortgage" "public"."products_mortgage_enum" NOT NULL DEFAULT 'NONE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "mortgage"`);
    await queryRunner.query(`DROP TYPE "public"."products_mortgage_enum"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "mortgage" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "UQ_9a5f6868c96e0069e699f33e124"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category_id"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "time_unit"`);
    await queryRunner.query(`DROP TYPE "public"."products_time_unit_enum"`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "required_documents"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."products_required_documents_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "is_vehicle"`);
  }
}
