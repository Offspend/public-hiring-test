import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { getTestFoodProduct, TEST_CARBON_EMISSION_FACTORS } from "../seed-dev-data";
import {FoodProductService} from "./foodProduct.service";
import {FoodProduct} from "./foodProduct.entity";
import {CarbonEmissionFactorsService} from "../carbonEmissionFactor/carbonEmissionFactors.service";
import {CarbonEmissionFactor} from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import {CarbonFootprintCalculatorService} from "../carbonFootprintCalculator/carbonFootprintCalculator.service";

let hamPizza = getTestFoodProduct("ham pizza");
let hamSandwich = getTestFoodProduct("ham sandwich");
let vegetarianPizza = getTestFoodProduct("vegetarian pizza");
let foodProductService: FoodProductService;

beforeAll(async () => {
  await dataSource.initialize();
  foodProductService = new FoodProductService(
    dataSource.getRepository(FoodProduct),
          new CarbonEmissionFactorsService(dataSource.getRepository(CarbonEmissionFactor)),
          new CarbonFootprintCalculatorService(),
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource
          .getRepository(CarbonEmissionFactor)
          .save(TEST_CARBON_EMISSION_FACTORS);
  await dataSource
          .getRepository(FoodProduct)
          .save(hamPizza);
});

describe("FoodProduct.service", () => {
  it("should save new foodProducts", async () => {
    await foodProductService.save([
      vegetarianPizza,
    ], true);
    await foodProductService.save([
      hamSandwich,
    ], false);

    const retrieveVegetarianPizzaFoodProduct = await dataSource
            .getRepository(FoodProduct)
            .findOne({ where: { name: "vegetarian pizza" } });
    expect(retrieveVegetarianPizzaFoodProduct?.name).toBe("vegetarian pizza");
    expect(retrieveVegetarianPizzaFoodProduct?.carbonFootprint).toBeNull();

    const retrieveHamSandwichFoodProduct = await dataSource
            .getRepository(FoodProduct)
            .findOne({ where: { name: "ham sandwich" } });
    expect(retrieveHamSandwichFoodProduct?.name).toBe("ham sandwich");
    expect(retrieveHamSandwichFoodProduct?.carbonFootprint).not.toBeNull();

  });
  it("should retrieve food products", async () => {
    const foodProducts = await foodProductService.findAll();
    expect(foodProducts).toHaveLength(1);
  });
  it("should compute food product carbon footprint", async () => {
    const retrieveHamPizzaFoodProduct = await dataSource
            .getRepository(FoodProduct)
            .findOne({ where: { name: "ham pizza" } });
    await foodProductService.computeCarbonFootprint(retrieveHamPizzaFoodProduct!);
    expect(retrieveHamPizzaFoodProduct!.carbonFootprint).not.toBeNull();
    await retrieveHamPizzaFoodProduct!.save();
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
