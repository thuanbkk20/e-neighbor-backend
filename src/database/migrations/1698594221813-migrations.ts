import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1698594221813 implements MigrationInterface {
  name = 'Migrations1698594221813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_name" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying, "address" character varying, "detailed_address" character varying, "dob" TIMESTAMP, "phone_number" character varying, "full_name" character varying, "role" character varying NOT NULL, "cccd" character varying, CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lessors" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying, "ware_house_address" character varying NOT NULL, "response_rate" integer, "response_time" integer, "agreement_rate" integer, "user_id" integer, CONSTRAINT "REL_6f08a5f57c34639042797b17d8" UNIQUE ("user_id"), CONSTRAINT "PK_9ea207ec8c61842e339bacc76c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_name" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying, CONSTRAINT "UQ_e2ca4b65f127467fe2dd1f4d7ce" UNIQUE ("user_name"), CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessors" ADD CONSTRAINT "FK_6f08a5f57c34639042797b17d82" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lessors" DROP CONSTRAINT "FK_6f08a5f57c34639042797b17d82"`,
    );
    await queryRunner.query(`DROP TABLE "admin"`);
    await queryRunner.query(`DROP TABLE "lessors"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
