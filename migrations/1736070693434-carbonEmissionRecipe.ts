import { MigrationInterface, QueryRunner } from "typeorm";

export class CarbonEmissionRecipe1736070693434 implements MigrationInterface {
    name = 'CarbonEmissionRecipe1736070693434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carbon_emission_recipes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "totalCarbonEmission" numeric(10,2) NOT NULL, CONSTRAINT "PK_10eb4f3629f3f95398fc258654e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_ingredients" ("id" SERIAL NOT NULL, "value" numeric(10,2) NOT NULL, "unit" character varying NOT NULL, "recipe_id" integer NOT NULL, "carbon_emission_factor_id" integer NOT NULL, CONSTRAINT "PK_8f15a314e55970414fc92ffb532" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_f240137e0e13bed80bdf64fed53" FOREIGN KEY ("recipe_id") REFERENCES "carbon_emission_recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_a1e96b9cf9850961a6c0d0d9f6f" FOREIGN KEY ("carbon_emission_factor_id") REFERENCES "carbon_emission_factors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_a1e96b9cf9850961a6c0d0d9f6f"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_f240137e0e13bed80bdf64fed53"`);
        await queryRunner.query(`DROP TABLE "recipe_ingredients"`);
        await queryRunner.query(`DROP TABLE "carbon_emission_recipes"`);
    }

}
