import { MigrationInterface, QueryRunner } from "typeorm";

export class CarbonFootPrint1708367794381 implements MigrationInterface {
  name = "CarbonFootPrint1708367794381";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "calculated_carbon_footprints" ("id" SERIAL NOT NULL, "recipe" character varying NOT NULL, "totalCarbonFootprint" float NOT NULL, CONSTRAINT "PK_e6b201ea58a7b4cdec0ca1c0c61" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "calculated_carbon_footprints"`);
  }
}