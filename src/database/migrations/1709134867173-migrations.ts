import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1709134867173 implements MigrationInterface {
  name = 'Migrations1709134867173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "insurance" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "images" text NOT NULL, "issue_date" TIMESTAMP NOT NULL, "expiration_date" TIMESTAMP NOT NULL, "product_id" integer, CONSTRAINT "REL_bbb7fc44688b265d71963a017c" UNIQUE ("product_id"), CONSTRAINT "PK_07152a21fd75ea211dcea53e3c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "insurance" ADD CONSTRAINT "FK_bbb7fc44688b265d71963a017cb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "insurance" DROP CONSTRAINT "FK_bbb7fc44688b265d71963a017cb"`,
    );
    await queryRunner.query(`DROP TABLE "insurance"`);
  }
}
