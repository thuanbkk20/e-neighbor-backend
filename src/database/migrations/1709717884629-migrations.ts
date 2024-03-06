import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1709717884629 implements MigrationInterface {
  name = 'Migrations1709717884629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "inboxs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "sender_id" integer, "receiver_id" integer, CONSTRAINT "REL_7256c1a03a27376f26815c141f" UNIQUE ("sender_id"), CONSTRAINT "REL_aab827703a5024e359e0cbead6" UNIQUE ("receiver_id"), CONSTRAINT "PK_58df8ed8f751e8c281166e54320" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_order_status_enum" AS ENUM('PENDING', 'APPROVED', 'IN PROGRESS', 'COMPLETED', 'CANCELED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_payment_status_enum" AS ENUM('COMPLETE', 'INCOMPLETE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "rent_time" TIMESTAMP NOT NULL, "return_time" TIMESTAMP NOT NULL, "real_rent_time" TIMESTAMP NOT NULL, "real_return_time" TIMESTAMP NOT NULL, "condition_upon_receipt" character varying NOT NULL, "images_upon_receipt" text NOT NULL, "condition_upon_return" character varying NOT NULL, "images_upon_return" text NOT NULL, "delivery_address" text NOT NULL, "order_value" integer NOT NULL, "order_status" "public"."orders_order_status_enum" NOT NULL DEFAULT 'PENDING', "payment_status" "public"."orders_payment_status_enum" NOT NULL DEFAULT 'INCOMPLETE', CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedbacks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "image" character varying, "star" integer NOT NULL, "order_id" integer, CONSTRAINT "REL_c87adf1f5a4fea797ae45bf353" UNIQUE ("order_id"), CONSTRAINT "PK_79affc530fdd838a9f1e0cc30be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_payment_type_enum" AS ENUM('ORDER', 'SERVICE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "payment_amount" integer NOT NULL, "payment_type" "public"."payment_payment_type_enum" NOT NULL DEFAULT 'ORDER', "payment_method_id" integer, "order_id" integer, CONSTRAINT "REL_f5221735ace059250daac9d980" UNIQUE ("order_id"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "inboxs" ADD CONSTRAINT "FK_7256c1a03a27376f26815c141f9" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inboxs" ADD CONSTRAINT "FK_aab827703a5024e359e0cbead63" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_c87adf1f5a4fea797ae45bf3530" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_365af7f69f9142427cf30395b00" FOREIGN KEY ("payment_method_id") REFERENCES "payment_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_f5221735ace059250daac9d9803" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_f5221735ace059250daac9d9803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_365af7f69f9142427cf30395b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_c87adf1f5a4fea797ae45bf3530"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inboxs" DROP CONSTRAINT "FK_aab827703a5024e359e0cbead63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inboxs" DROP CONSTRAINT "FK_7256c1a03a27376f26815c141f9"`,
    );
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."payment_payment_type_enum"`);
    await queryRunner.query(`DROP TABLE "feedbacks"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_order_status_enum"`);
    await queryRunner.query(`DROP TABLE "inboxs"`);
  }
}
