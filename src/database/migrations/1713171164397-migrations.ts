import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713171164397 implements MigrationInterface {
  name = 'Migrations1713171164397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental_fee" DROP CONSTRAINT "FK_19b872560dbf0555220ff0f4e46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental_fee" DROP COLUMN "product_id"`,
    );
    await queryRunner.query(`ALTER TABLE "rental_fee" ADD "order_id" integer`);
    await queryRunner.query(`ALTER TABLE "rental_fee" DROP COLUMN "name"`);
    await queryRunner.query(
      `CREATE TYPE "public"."rental_fee_name_enum" AS ENUM('product.fee.standard', 'products.surCharge.lateFees', 'products.surCharge.sanityFees', 'products.surCharge.damageFees')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental_fee" ADD "name" "public"."rental_fee_name_enum" NOT NULL DEFAULT 'product.fee.standard'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental_fee" ADD CONSTRAINT "FK_afda37f687de580f5097a8734a6" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental_fee" DROP CONSTRAINT "FK_afda37f687de580f5097a8734a6"`,
    );
    await queryRunner.query(`ALTER TABLE "rental_fee" DROP COLUMN "name"`);
    await queryRunner.query(`DROP TYPE "public"."rental_fee_name_enum"`);
    await queryRunner.query(
      `ALTER TABLE "rental_fee" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "rental_fee" DROP COLUMN "order_id"`);
    await queryRunner.query(
      `ALTER TABLE "rental_fee" ADD "product_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental_fee" ADD CONSTRAINT "FK_19b872560dbf0555220ff0f4e46" FOREIGN KEY ("product_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
