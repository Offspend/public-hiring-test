import { MigrationInterface, QueryRunner } from "typeorm";

export class CarbonEmissionRecipe1736077029662 implements MigrationInterface {
    name = 'CarbonEmissionRecipe1736077029662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_emission_recipes" ALTER COLUMN "totalCarbonEmission" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_emission_recipes" ALTER COLUMN "totalCarbonEmission" SET NOT NULL`);
    }

}
