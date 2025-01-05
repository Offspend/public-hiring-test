import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { getTestEmissionRecipe, seedTestCarbonEmissionFactors } from "../seed-dev-data";
import { CarbonEmissionRecipe } from "./carbonEmissionRecipe.entity";
import { CarbonEmissionRecipeService } from "./carbonEmissionRecipe.service";

let carbonEmissionRecipeService: CarbonEmissionRecipeService;
let pizzaRecipe = getTestEmissionRecipe('Pizza Margherita')
let hamburgerRecipe = getTestEmissionRecipe('Hamburger')
let saladRecipe = getTestEmissionRecipe('Salad')

beforeAll(async () => {
    await dataSource.initialize();
    carbonEmissionRecipeService = new CarbonEmissionRecipeService(
        dataSource.getRepository(CarbonEmissionRecipe),
    );
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
    await seedTestCarbonEmissionFactors();
    await dataSource.getRepository(CarbonEmissionRecipe).save([pizzaRecipe, hamburgerRecipe, saladRecipe]);
});

describe("CarbonEmissionRecipe.service", () => {
    describe("calculateAndSaveEmission", () => {
        it("should calculate emission for recipe with same units (kg)", async () => {
            const pizzaId = (await dataSource.getRepository(CarbonEmissionRecipe).findOne({
                where: { name: "Pizza Margherita" }
            }))?.id;

            const result = await carbonEmissionRecipeService.calculateAndSaveEmission(pizzaId!);

            const expectedTotalEmission = 0.2 * 0.13 + 0.15 * 0.12 + 0.3 * 0.14 + 0.02 * 0.15;

            expect(result.totalCarbonEmission).not.toBeNull();
            expect(result.totalCarbonEmission).toBeCloseTo(expectedTotalEmission, 5);
            expect(result.ingredients).toHaveLength(4);
            expect(result.name).toBe("Pizza Margherita");
        });

        it("should calculate emission with unit conversion (g to kg)", async () => {
            const hamburgerId = (await dataSource.getRepository(CarbonEmissionRecipe).findOne({
                where: { name: "Hamburger" }
            }))?.id;

            const result = await carbonEmissionRecipeService.calculateAndSaveEmission(hamburgerId!);

            const expectedTotalEmission = 0.15 * 14 + (3 / 1000) * 0.12 + 0.05 * 0.13;

            expect(result.totalCarbonEmission).not.toBeNull();
            expect(result.totalCarbonEmission).toBeCloseTo(expectedTotalEmission, 5);
            expect(result.ingredients).toHaveLength(3);
            expect(result.name).toBe("Hamburger");
        });

        it("should throw UnprocessableEntityException for unknown units", async () => {
            const saladId = (await dataSource.getRepository(CarbonEmissionRecipe).findOne({
                where: { name: "Salad" }
            }))?.id;

            await expect(carbonEmissionRecipeService.calculateAndSaveEmission(saladId!))
                .rejects
                .toThrow(UnprocessableEntityException);

            const recipeAfterCalculation = await carbonEmissionRecipeService.findOne(saladId!);
            expect(recipeAfterCalculation.totalCarbonEmission).toBeNull();
        });

        it("should throw NotFoundException for non-existent recipe", async () => {
            await expect(carbonEmissionRecipeService.calculateAndSaveEmission(999))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe("findOne", () => {
        it("should retrieve a recipe with its ingredients", async () => {
            const pizzaId = (await dataSource.getRepository(CarbonEmissionRecipe).findOne({
                where: { name: "Pizza Margherita" }
            }))?.id;

            const recipe = await carbonEmissionRecipeService.findOne(pizzaId!);

            expect(recipe.name).toBe("Pizza Margherita");
            expect(recipe.ingredients).toHaveLength(4);
        });

        it("should throw NotFoundException for non-existent recipe", async () => {
            await expect(carbonEmissionRecipeService.findOne(999))
                .rejects
                .toThrow(NotFoundException);
        });
    });
});

afterAll(async () => {
    await dataSource.destroy();
});
