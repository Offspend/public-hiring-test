import { dataSource } from "../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor/carbonEmissionFactor.entity";
import {CarbonFootprintCalculation} from "./carbonFootprintCalculation/carbonFootprintCalculation.entity";

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

export const seedTestCarbonEmissionFactors = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const carbonEmissionFactorsService =
    dataSource.getRepository(CarbonEmissionFactor);

  await carbonEmissionFactorsService.save(TEST_CARBON_EMISSION_FACTORS);
};

if (require.main === module) {
  seedTestCarbonEmissionFactors().catch((e) => console.error(e));
}

export const TEST_FOOTPRINT_CALCULATIONS = [
  {
    name: "hamCheesePizza",
    ingredients: [
      { name: "ham", quantity: 0.1, unit: "kg" },
      { name: "cheese", quantity: 0.15, unit: "kg" },
      { name: "tomato", quantity: 0.4, unit: "kg" },
      { name: "floor", quantity: 0.7, unit: "kg" },
      { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
    carbonFootprint: 1.1,
  },
  {
    name: "cheesePizza",
    ingredients: [
      { name: "cheese", quantity: 0.15, unit: "kg" },
      { name: "tomato", quantity: 0.4, unit: "kg" },
      { name: "floor", quantity: 0.7, unit: "kg" },
      { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
    carbonFootprint: 1.,
  },
].map((args) => {
  return new CarbonFootprintCalculation({
    foodProductName: args.name,
    ingredients: args.ingredients,
    carbonFootprint: args.carbonFootprint,
  });
});

export const getTestFootprintCalculation = (foodProductName: string) => {
  const footprintCalculation = TEST_FOOTPRINT_CALCULATIONS.find(
      (fc) => fc.foodProductName === foodProductName
  );
  if (!footprintCalculation) {
    throw new Error(
        `test footprint calculation with name ${foodProductName} could not be found`
    );
  }
  return footprintCalculation;
};
