import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1709732928139 implements MigrationInterface {
  name = 'Migrations1709732928139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "surcharge" DROP CONSTRAINT "FK_b1e953887223f1ff0fa9f14750e"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_surcharge" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "price" integer NOT NULL, "surcharge_id" integer, "product_id" integer, CONSTRAINT "PK_5dabe3a31c3222a0f5878886716" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "surcharge" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "surcharge" DROP COLUMN "product_id"`);
    await queryRunner.query(
      `ALTER TABLE "product_surcharge" ADD CONSTRAINT "FK_720c58708d47d20616883d685e8" FOREIGN KEY ("surcharge_id") REFERENCES "surcharge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_surcharge" ADD CONSTRAINT "FK_dbc93f7324873868f40d84dcb1d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_surcharge" DROP CONSTRAINT "FK_dbc93f7324873868f40d84dcb1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_surcharge" DROP CONSTRAINT "FK_720c58708d47d20616883d685e8"`,
    );
    await queryRunner.query(`ALTER TABLE "surcharge" ADD "product_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "surcharge" ADD "price" integer NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "product_surcharge"`);
    await queryRunner.query(
      `ALTER TABLE "surcharge" ADD CONSTRAINT "FK_b1e953887223f1ff0fa9f14750e" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
