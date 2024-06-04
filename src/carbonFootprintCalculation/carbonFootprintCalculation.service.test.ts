import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonFootprintCalculationService } from "./carbonFootprintCalculation.service";
import { CarbonFootprintCalculation } from "./carbonFootprintCalculation.entity";
import { CarbonFootprintCalculator } from "../carbonFootprintCalculator/domain/carbonFootprintCalculator.interface";
import {getTestFootprintCalculation} from "../seed-dev-data";

let hamChessePizzaFootprint = getTestFootprintCalculation("hamCheesePizza");
let carbonFootprintCalculationService: CarbonFootprintCalculationService;
const mockCarbonFootprintCalculator = {
  calculateCarbonFootprintOfIngredients: jest.fn(),
};

beforeAll(async () => {
  await dataSource.initialize();

  carbonFootprintCalculationService = new CarbonFootprintCalculationService(
    dataSource.getRepository(CarbonFootprintCalculation),
      mockCarbonFootprintCalculator as unknown as CarbonFootprintCalculator,
  );
});

beforeEach(async () => {
  jest.clearAllMocks();

  await GreenlyDataSource.cleanDatabase();
  await dataSource
    .getRepository(CarbonFootprintCalculation)
    .save(hamChessePizzaFootprint);
});

describe("CarbonFootprintCalculation.service", () => {
  it("should retrieve all footprint calculations", async () => {
    const footprintCalculations = await carbonFootprintCalculationService.findAll();
    expect(footprintCalculations).toHaveLength(1);
  });

  it("should return null if getting footprint calculations by ID doesn't exists", async () => {
    const footprintCalculation = await carbonFootprintCalculationService.findById(42);
    expect(footprintCalculation).toEqual(null);
  });

  it("should retrieve one footprint calculations by ID", async () => {
    const footprintCalculation = await carbonFootprintCalculationService.findById(hamChessePizzaFootprint.id);
    expect(footprintCalculation).toEqual(hamChessePizzaFootprint);
  });

  it("should return null if getting footprint calculations by product name doesn't exists", async () => {
    const footprintCalculation = await carbonFootprintCalculationService.findByFoodProductName("funkyPizza");
    expect(footprintCalculation).toEqual(null);
  });

  it("should retrieve one footprint calculation by product name", async () => {
    const footprintCalculation = await carbonFootprintCalculationService.findByFoodProductName("hamCheesePizza");
    expect(footprintCalculation).toEqual(hamChessePizzaFootprint);
  });

  it("should create a footprint calculation", async () => {
    mockCarbonFootprintCalculator.calculateCarbonFootprintOfIngredients.mockReturnValueOnce(Promise.resolve(0.4));

    const footprintCalculation = await carbonFootprintCalculationService.create({
        foodProductName: "cheesePizza",
        ingredients: [
            { name: "tomato", quantity: 0.1, unit: "kg" },
            { name: "cheese", quantity: 0.2, unit: "kg" },
        ],
    });

    expect(footprintCalculation?.carbonFootprint).toEqual(0.4);
  });
});

afterAll(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource.destroy();
});
