import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1709734805477 implements MigrationInterface {
  name = 'Migrations1709734805477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rental_fee" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "amount" integer NOT NULL, "product_id" integer, CONSTRAINT "PK_faf33f1294903b80d978c59507d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental_fee" ADD CONSTRAINT "FK_19b872560dbf0555220ff0f4e46" FOREIGN KEY ("product_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental_fee" DROP CONSTRAINT "FK_19b872560dbf0555220ff0f4e46"`,
    );
    await queryRunner.query(`DROP TABLE "rental_fee"`);
  }
}
