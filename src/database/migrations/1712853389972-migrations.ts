import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1712853389972 implements MigrationInterface {
  name = 'Migrations1712853389972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."products_mortgage_enum" RENAME TO "products_mortgage_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_mortgage_enum" AS ENUM('product.mortgage.none', 'product.mortgage.motorbike.deposite')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "mortgage" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "mortgage" TYPE "public"."products_mortgage_enum" USING "mortgage"::"text"::"public"."products_mortgage_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "mortgage" SET DEFAULT 'product.mortgage.none'`,
    );
    await queryRunner.query(`DROP TYPE "public"."products_mortgage_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."products_required_documents_enum" RENAME TO "products_required_documents_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_required_documents_enum" AS ENUM('product.reqDocs.none', 'product.reqDocs.need.citizenCard.with.driverLicense', 'product.reqDocs.keep.passport')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "required_documents" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "required_documents" TYPE "public"."products_required_documents_enum" USING "required_documents"::"text"::"public"."products_required_documents_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "required_documents" SET DEFAULT 'product.reqDocs.none'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."products_required_documents_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."products_required_documents_enum_old" AS ENUM('NONE', 'OPTION1', 'OPTION2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "required_documents" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "required_documents" TYPE "public"."products_required_documents_enum_old" USING "required_documents"::"text"::"public"."products_required_documents_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "required_documents" SET DEFAULT 'NONE'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."products_required_documents_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."products_required_documents_enum_old" RENAME TO "products_required_documents_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_mortgage_enum_old" AS ENUM('NONE', 'OPTION1')`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "mortgage" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "mortgage" TYPE "public"."products_mortgage_enum_old" USING "mortgage"::"text"::"public"."products_mortgage_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "mortgage" SET DEFAULT 'NONE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."products_mortgage_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."products_mortgage_enum_old" RENAME TO "products_mortgage_enum"`,
    );
  }
}
