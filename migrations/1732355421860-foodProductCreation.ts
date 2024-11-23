import { MigrationInterface, QueryRunner } from "typeorm";

export class FoodProductCreation1732355421860 implements MigrationInterface {
    name = 'foodProductCreation1732355421860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "food_products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "carbonFootprint" double precision, "recipe" json NOT NULL, CONSTRAINT "PK_3aca8796e89325904061ed18b12" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "food_products"`);
    }

}
