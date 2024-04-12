import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1712913198906 implements MigrationInterface {
  name = 'Migrations1712913198906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."lessors_location_enum" AS ENUM('common.location.HCM', 'common.location.HN')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessors" ADD "location" "public"."lessors_location_enum" NOT NULL DEFAULT 'common.location.HCM'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessors" DROP COLUMN "location"`);
    await queryRunner.query(`DROP TYPE "public"."lessors_location_enum"`);
  }
}
