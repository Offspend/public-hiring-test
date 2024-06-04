import { MigrationInterface, QueryRunner } from "typeorm";

export class CarbonFootprintCalculation1717498763620 implements MigrationInterface {
    name = 'CarbonFootprintCalculation1717498763620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carbon_footprint_calculation" ("id" SERIAL NOT NULL, "foodProductName" character varying NOT NULL, "ingredients" jsonb NOT NULL, "carbonFootprint" double precision, CONSTRAINT "UQ_718518cea3c47a1c03b1af2954e" UNIQUE ("foodProductName"), CONSTRAINT "PK_3bb411dd700365c298d3fe841e8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "carbon_footprint_calculation"`);
    }

}
