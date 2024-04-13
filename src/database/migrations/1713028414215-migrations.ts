import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713028414215 implements MigrationInterface {
  name = 'Migrations1713028414215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "rent_price" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_time_unit_enum" AS ENUM('product.price.time.unit.day', 'product.price.time.unit.week', 'product.price.time.unit.month')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "time_unit" "public"."orders_time_unit_enum" NOT NULL DEFAULT 'product.price.time.unit.day'`,
    );
    await queryRunner.query(`ALTER TABLE "orders" ADD "user_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "time_unit"`);
    await queryRunner.query(`DROP TYPE "public"."orders_time_unit_enum"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "rent_price"`);
  }
}
