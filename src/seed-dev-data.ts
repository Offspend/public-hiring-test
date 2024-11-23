import { dataSource } from "../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor/carbonEmissionFactor.entity";
import {FoodProduct} from "./foodProduct/foodProduct.entity";

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

export const TEST_FOOD_PRODUCT = [
  {
    name: "ham pizza",
    carbonFootprint: null,
    recipe: {
      ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "flour", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
      ],
    }
  },
  {
    name: "ham sandwich",
    carbonFootprint: null,
    recipe: {
      ingredients: [
        { name: "ham", quantity: 0.2, unit: "kg" },
        { name: "cheese", quantity: 0.1, unit: "kg" },
        { name: "tomato", quantity: 0.1, unit: "kg" },
        { name: "flour", quantity: 0.6, unit: "kg" },
        { name: "oliveOil", quantity: 0.1, unit: "kg" },
      ],
    }
  },
  {
    name: "vegetarian pizza",
    carbonFootprint: null,
    recipe: {
      ingredients: [
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "flour", quantity: 0.6, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
      ],
    }
  },
].map((args) => {
  return new FoodProduct({
    name: args.name,
    recipe: args.recipe,
    carbonFootprint: args.carbonFootprint,
  });
});

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

export const getTestFoodProduct = (name: string) => {
  const foodProduct = TEST_FOOD_PRODUCT.find(
    (ef) => ef.name === name
  );
  if (!foodProduct) {
    throw new Error(
      `test food product with name ${name} could not be found`
    );
  }
  return foodProduct;
};

export const seedTestCarbonEmissionFactors = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const carbonEmissionFactorsService =
    dataSource.getRepository(CarbonEmissionFactor);

  await carbonEmissionFactorsService.save(TEST_CARBON_EMISSION_FACTORS);
};

export const seedTestFoodProducts = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const service =
    dataSource.getRepository(FoodProduct);

  await service.save(TEST_FOOD_PRODUCT);
};

if (require.main === module) {
  seedTestCarbonEmissionFactors().catch((e) => console.error(e));
  seedTestFoodProducts().catch((e) => console.error(e));
}
