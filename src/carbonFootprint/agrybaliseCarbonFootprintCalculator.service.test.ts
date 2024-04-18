import { ICarbonEmissionFactorsService } from "src/carbonEmissionFactor/carbonEmissionFactors.service";
import { AgrybaliseCarbonFootprintCalculatorService } from "./agrybaliseCarbonFootprintCalculator.service";
import { FoodProduct } from "./domain/FoodProduct";
import { Ingredient } from "./domain/Ingredient";
import { CarbonEmissionFactor } from "src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { CreateCarbonEmissionFactorDto } from "src/carbonEmissionFactor/dto/create-carbonEmissionFactor.dto";
import { TEST_CARBON_EMISSION_FACTORS } from "../seed-dev-data";

class MockCarbonEmissionFactorsService
  implements ICarbonEmissionFactorsService
{
  constructor(public readonly carbonEmissionFactors: CarbonEmissionFactor[]) {}

  async findAll(): Promise<CarbonEmissionFactor[]> {
    return this.carbonEmissionFactors;
  }

  save(
    _carbonEmissionFactor: CreateCarbonEmissionFactorDto[],
  ): Promise<CarbonEmissionFactor[] | null> {
    throw new Error("Method not implemented.");
  }
}

describe("agrybaliseCarbonFootprintCalculator", () => {
  const sut = new AgrybaliseCarbonFootprintCalculatorService(
    new MockCarbonEmissionFactorsService(TEST_CARBON_EMISSION_FACTORS),
  );

  describe("given all ingredients have a carbon footprint", () => {
    it("should calculate the carbon footprint of a food product", async () => {
      const pizza = new FoodProduct("pizza", [
        new Ingredient("ham", 1),
        new Ingredient("cheese", 1),
        new Ingredient("tomato", 2),
        new Ingredient("flour", 3),
        new Ingredient("oliveOil", 0.5),
      ]);

      const carbonFootprint = await sut.calculate(pizza);

      expect(carbonFootprint).toEqual({ weight: 0.985, unit: "kg" });
    });
  });

  describe("given some ingredients do not have a carbon footprint", () => {
    it("should return null", async () => {
      const orangeJuice = new FoodProduct("orangeJuice", [
        new Ingredient("orange", 1),
      ]);

      const carbonFootprint = await sut.calculate(orangeJuice);
      expect(carbonFootprint).toBeNull();
    });
  });
});
