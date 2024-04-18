import { MigrationInterface, QueryRunner } from "typeorm";

export class CarbonFootprint1713350849672 implements MigrationInterface {
    name = 'CarbonFootprint1713350849672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carbon_footprint" ("id" SERIAL NOT NULL, "weight" double precision, "unit" character varying NOT NULL, "productName" character varying NOT NULL, CONSTRAINT "UQ_c35f4290fc1ca68e471b9346a5d" UNIQUE ("productName"), CONSTRAINT "PK_905c15ce8d098547599337b7669" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "carbon_footprint"`);
    }

}
