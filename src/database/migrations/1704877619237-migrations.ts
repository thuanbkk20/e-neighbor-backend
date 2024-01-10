import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1704877619237 implements MigrationInterface {
  name = 'Migrations1704877619237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "is_confirmed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "lessor_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_decd63ff9fde86966b4b1ddc435" FOREIGN KEY ("lessor_id") REFERENCES "lessors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_decd63ff9fde86966b4b1ddc435"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "lessor_id"`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "is_confirmed"`,
    );
  }
}
