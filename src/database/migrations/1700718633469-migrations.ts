import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1700718633469 implements MigrationInterface {
  name = 'Migrations1700718633469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_method" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" character varying NOT NULL, "account_number" integer NOT NULL, "user_id" integer, CONSTRAINT "PK_7744c2b2dd932c9cf42f2b9bc3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD CONSTRAINT "FK_b9f0b59dc5fd5150f2df494a480" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP CONSTRAINT "FK_b9f0b59dc5fd5150f2df494a480"`,
    );
    await queryRunner.query(`DROP TABLE "payment_method"`);
  }
}
