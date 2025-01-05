import { dataSource } from "../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionRecipe } from "./carbonEmissionRecipe/carbonEmissionRecipe.entity";
import { RecipeIngredient } from "./carbonEmissionRecipe/recipeIngredient.entity";


export const getTestEmissionFactor = (name: string) => {
  const emissionFactor = TEST_CARBON_EMISSION_FACTORS.find(
    (ef) => ef.name === name
  );
  if (!emissionFactor) {
    throw new Error(
      `test emission factor with name ${name} could not be found`
    );
  }
  return emissionFactor;
};

export const getTestEmissionRecipe = (name: string) => {
  const emissionRecipe = TEST_CARBON_EMISSION_RECIPES.find(
    (ef) => ef.name === name
  );
  if (!emissionRecipe) {
    throw new Error(
      `test emission recipe with name ${name} could not be found`
    );
  }
  return emissionRecipe;
};

export const TEST_CARBON_EMISSION_FACTORS = [
  {
    name: "ham",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.11,
    source: "Agrybalise",
  },
  {
    name: "cheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.12,
    source: "Agrybalise",
  },
  {
    name: "tomato",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.13,
    source: "Agrybalise",
  },
  {
    name: "flour",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "blueCheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.34,
    source: "Agrybalise",
  },
  {
    name: "vinegar",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "beef",
    unit: "kg",
    emissionCO2eInKgPerUnit: 14,
    source: "Agrybalise",
  },
  {
    name: "oliveOil",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.15,
    source: "Agrybalise",
  },
].map((args) => {
  return new CarbonEmissionFactor({
    name: args.name,
    unit: args.unit,
    emissionCO2eInKgPerUnit: args.emissionCO2eInKgPerUnit,
    source: args.source,
  });
});

export const calculateTotalEmission = (ingredients: {
  carbonEmissionFactor: CarbonEmissionFactor;
  value: number;
}[]) => {
  return ingredients.reduce(
    (total, ingredient) =>
      total + ingredient.carbonEmissionFactor.emissionCO2eInKgPerUnit * ingredient.value,
    0
  );
};

export const TEST_CARBON_EMISSION_RECIPES = [
  {
    name: "Pizza Margherita",
    ingredients: [
      {
        carbonEmissionFactor: getTestEmissionFactor("tomato"),
        value: 0.2,
        unit: "kg",
      },
      {
        carbonEmissionFactor: getTestEmissionFactor("cheese"),
        value: 0.15,
        unit: "kg",
      },
      {
        carbonEmissionFactor: getTestEmissionFactor("flour"),
        value: 0.3,
        unit: "kg",
      },
      {
        carbonEmissionFactor: getTestEmissionFactor("oliveOil"),
        value: 0.02,
        unit: "kg",
      },
    ],
  },
  {
    name: "Hamburger",
    ingredients: [
      {
        carbonEmissionFactor: getTestEmissionFactor("beef"),
        value: 0.15,
        unit: "kg",
      },
      {
        carbonEmissionFactor: getTestEmissionFactor("cheese"),
        value: 3,
        unit: "g", // Different unit than carbonEmissionFactor
      },
      {
        carbonEmissionFactor: getTestEmissionFactor("tomato"),
        value: 0.05,
        unit: "kg",
      },
    ],
  },
  {
    name: "Salad",
    ingredients: [
      {
        carbonEmissionFactor: getTestEmissionFactor("ham"),
        value: 0.15,
        unit: "kg",
      },
      {
        carbonEmissionFactor: getTestEmissionFactor("oliveOil"),
        value: 3,
        unit: "hg", // Wrong unit 
      },
      {
        carbonEmissionFactor: getTestEmissionFactor("tomato"),
        value: 0.05,
        unit: "kg",
      },
    ],
  },
].map((args) => {
  const recipeEntity = new CarbonEmissionRecipe({
    name: args.name,
    ingredients: [],
    totalCarbonEmission: null,
  });

  const ingredients = args.ingredients.map(ingredient =>
    new RecipeIngredient({
      recipe: recipeEntity,
      carbonEmissionFactor: ingredient.carbonEmissionFactor,
      value: ingredient.value,
      unit: ingredient.unit,
    })
  );

  recipeEntity.ingredients = ingredients;
  recipeEntity.totalCarbonEmission = null

  return recipeEntity;
});

export const seedTestCarbonEmissionFactors = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const carbonEmissionFactorsService =
    dataSource.getRepository(CarbonEmissionFactor);

  await carbonEmissionFactorsService.save(TEST_CARBON_EMISSION_FACTORS);
};

export const seedTestCarbonEmissionRecipes = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  await seedTestCarbonEmissionFactors();

  const carbonEmissionRecipesService =
    dataSource.getRepository(CarbonEmissionRecipe);

  await carbonEmissionRecipesService.save(TEST_CARBON_EMISSION_RECIPES);
};

if (require.main === module) {
  seedTestCarbonEmissionRecipes()
    .catch((e) => console.error(e));
}
