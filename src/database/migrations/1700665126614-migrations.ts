import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1700665126614 implements MigrationInterface {
  name = 'Migrations1700665126614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_status_enum" AS ENUM('available', 'not_available')`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "status" "public"."products_status_enum" NOT NULL DEFAULT 'available', "mortgage" character varying, "description" character varying NOT NULL, "value" integer NOT NULL, "policies" text NOT NULL, "characteristics" text NOT NULL, "price" integer NOT NULL, "lessor_id" integer, CONSTRAINT "REL_decd63ff9fde86966b4b1ddc43" UNIQUE ("lessor_id"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_decd63ff9fde86966b4b1ddc435" FOREIGN KEY ("lessor_id") REFERENCES "lessors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_decd63ff9fde86966b4b1ddc435"`,
    );
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
