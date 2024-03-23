import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1711098834365 implements MigrationInterface {
  name = 'Migrations1711098834365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "product_id" integer`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "feedback_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_8ea5a4700a8127d5c73b920c983" UNIQUE ("feedback_id")`,
    );
    await queryRunner.query(`ALTER TABLE "orders" ADD "payment_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_5b3e94bd2aedc184f9ad8c10439" UNIQUE ("payment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_ac832121b6c331b084ecc4121fd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_8ea5a4700a8127d5c73b920c983" FOREIGN KEY ("feedback_id") REFERENCES "feedbacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_5b3e94bd2aedc184f9ad8c10439" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_5b3e94bd2aedc184f9ad8c10439"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_8ea5a4700a8127d5c73b920c983"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_ac832121b6c331b084ecc4121fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_5b3e94bd2aedc184f9ad8c10439"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payment_id"`);
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_8ea5a4700a8127d5c73b920c983"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "feedback_id"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "product_id"`);
  }
}
