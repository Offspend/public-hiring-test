import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionRecipe } from "./carbonEmissionRecipe.entity";
import { RecipeIngredient } from "./recipeIngredient.entity";

let pizzaRecipe: CarbonEmissionRecipe;
let tomatoFactor: CarbonEmissionFactor;

beforeAll(async () => {
    await dataSource.initialize();

    tomatoFactor = new CarbonEmissionFactor({
        emissionCO2eInKgPerUnit: 0.13,
        unit: "kg",
        name: "tomato",
        source: "Agrybalise",
    });

    pizzaRecipe = new CarbonEmissionRecipe({
        name: "Pizza Margherita",
        ingredients: [],
        totalCarbonEmission: null
    });

    const tomatoIngredient = new RecipeIngredient({
        recipe: pizzaRecipe,
        carbonEmissionFactor: tomatoFactor,
        value: 0.2,
        unit: "kg"
    });

    pizzaRecipe.ingredients = [tomatoIngredient];
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe("CarbonEmissionRecipe", () => {
    describe("constructor", () => {
        it("should create a recipe", () => {
            expect(pizzaRecipe.name).toBe("Pizza Margherita");
            expect(pizzaRecipe.totalCarbonEmission).toBeNull();
            expect(pizzaRecipe.ingredients).toHaveLength(1);
        });

        it("should throw an error if the name is empty", () => {
            expect(() => {
                new CarbonEmissionRecipe({
                    name: "",
                    ingredients: [],
                    totalCarbonEmission: null
                });
            }).toThrow();
        });

        it("should initialize with null totalCarbonEmission", () => {
            const recipe = new CarbonEmissionRecipe({
                name: "Test Recipe",
                ingredients: [],
                totalCarbonEmission: null
            });
            expect(recipe.totalCarbonEmission).toBeNull();
        });

        it("should correctly associate ingredients with the recipe", () => {
            expect(pizzaRecipe.ingredients[0].recipe).toBe(pizzaRecipe);
            expect(pizzaRecipe.ingredients[0].carbonEmissionFactor).toBe(tomatoFactor);
        });
    });
});

afterAll(async () => {
    await dataSource.destroy();
}); 