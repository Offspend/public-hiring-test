import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionRecipe } from "./carbonEmissionRecipe.entity";
import { RecipeIngredient } from "./recipeIngredient.entity";

let recipeIngredient: RecipeIngredient;
let recipe: CarbonEmissionRecipe;
let factor: CarbonEmissionFactor;

beforeAll(async () => {
    await dataSource.initialize();

    factor = new CarbonEmissionFactor({
        emissionCO2eInKgPerUnit: 0.13,
        unit: "kg",
        name: "tomato",
        source: "Agrybalise",
    });

    recipe = new CarbonEmissionRecipe({
        name: "Pizza Margherita",
        ingredients: [],
        totalCarbonEmission: null
    });

    recipeIngredient = new RecipeIngredient({
        recipe: recipe,
        carbonEmissionFactor: factor,
        value: 0.2,
        unit: "kg"
    });
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe("RecipeIngredient", () => {
    describe("constructor", () => {
        it("should create a recipe ingredient", () => {
            expect(recipeIngredient.value).toBe(0.2);
            expect(recipeIngredient.unit).toBe("kg");
            expect(recipeIngredient.recipe).toBe(recipe);
            expect(recipeIngredient.carbonEmissionFactor).toBe(factor);
        });

        it("should throw an error if value is negative", () => {
            expect(() => {
                new RecipeIngredient({
                    recipe: recipe,
                    carbonEmissionFactor: factor,
                    value: -1,
                    unit: "kg"
                });
            }).toThrow("Value cannot be negative");
        });

        it("should throw an error if unit is empty", () => {
            expect(() => {
                new RecipeIngredient({
                    recipe: recipe,
                    carbonEmissionFactor: factor,
                    value: 0.2,
                    unit: ""
                });
            }).toThrow("Unit cannot be empty");
        });

        it("should throw an error if carbonEmissionFactor is not provided", () => {
            expect(() => {
                new RecipeIngredient({
                    recipe: recipe,
                    carbonEmissionFactor: null as any,
                    value: 0.2,
                    unit: "kg"
                });
            }).toThrow("CarbonEmissionFactor is required");
        });

        it("should throw an error if recipe is not provided", () => {
            expect(() => {
                new RecipeIngredient({
                    recipe: null as any,
                    carbonEmissionFactor: factor,
                    value: 0.2,
                    unit: "kg"
                });
            }).toThrow("Recipe is required");
        });
    });
});

afterAll(async () => {
    await dataSource.destroy();
}); 