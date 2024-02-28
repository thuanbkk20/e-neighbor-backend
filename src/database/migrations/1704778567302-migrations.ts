import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1704778567302 implements MigrationInterface {
  name = 'Migrations1704778567302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_decd63ff9fde86966b4b1ddc435"`,
    );
    await queryRunner.query(
      `CREATE TABLE "surcharge" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "price" integer NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_a62b89257bcc802b5d77346f432" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "REL_decd63ff9fde86966b4b1ddc43"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "lessor_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "lessor_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "REL_decd63ff9fde86966b4b1ddc43" UNIQUE ("lessor_id")`,
    );
    await queryRunner.query(`DROP TABLE "surcharge"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_decd63ff9fde86966b4b1ddc435" FOREIGN KEY ("lessor_id") REFERENCES "lessors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
