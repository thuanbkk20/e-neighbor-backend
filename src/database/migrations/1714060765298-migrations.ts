import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1714060765298 implements MigrationInterface {
  name = 'Migrations1714060765298';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "thirdparty-payment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "merchant_id" character varying NOT NULL, "merchant_name" character varying NOT NULL, "amount" integer NOT NULL, "message" character varying NOT NULL, "bank" character varying NOT NULL, "transaction_id" character varying NOT NULL, "order_id" integer, CONSTRAINT "REL_a17591606406fe1156a01ae86f" UNIQUE ("order_id"), CONSTRAINT "PK_828462544059c20e8b4edb70d53" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "delivery_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "delivery_address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "thirdparty-payment" ADD CONSTRAINT "FK_a17591606406fe1156a01ae86f4" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "thirdparty-payment" DROP CONSTRAINT "FK_a17591606406fe1156a01ae86f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "delivery_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "delivery_address" text NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "thirdparty-payment"`);
  }
}
