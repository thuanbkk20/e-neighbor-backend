import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1712290922026 implements MigrationInterface {
  name = 'Migrations1712290922026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cccd"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "citizen_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "citizen_card_front" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "citizen_card_back" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessors" ADD "shop_name" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessors" DROP COLUMN "shop_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "citizen_card_back"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "citizen_card_front"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "citizen_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "cccd" character varying`);
  }
}
