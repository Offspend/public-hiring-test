import { AgrybaliseCarbonFootprintCalculatorService } from "./agrybaliseCarbonFootprintCalculator.service";
import { CarbonEmissionFactorProvider } from "../carbonEmissionFactor/domain/carbonEmissionFactor.interface";

let agrybaliseCarbonFootprintCalculatorService: AgrybaliseCarbonFootprintCalculatorService;
const mockCarbonEmissionFactorsService = {
  findByIngredients: jest.fn(),
};

beforeAll(async () => {
  agrybaliseCarbonFootprintCalculatorService = new AgrybaliseCarbonFootprintCalculatorService(
    mockCarbonEmissionFactorsService as unknown as CarbonEmissionFactorProvider,
  );
});

beforeEach(async () => {
  jest.clearAllMocks();
});

describe("AgrybaliseCarbonFootprintCalculatorService.service", () => {
  it("should return null when calculating footprint with one missing ingredient", async () => {
    mockCarbonEmissionFactorsService.findByIngredients.mockReturnValueOnce(Promise.resolve([
      { id: 1, name: "ham", emissionCO2eInKgPerUnit: 2.5, unit: "kg", source: "Agrybalise" },
      { id: 2, name: "cheese", emissionCO2eInKgPerUnit: 2.4, unit: "kg", source: "Agrybalise" },
    ]));

    const carbonFootprint = await agrybaliseCarbonFootprintCalculatorService.calculateCarbonFootprintOfIngredients([
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
    ]);

    expect(carbonFootprint).toEqual(null);
  });

  it("should return a correct footprint with no missing ingredient", async () => {
    mockCarbonEmissionFactorsService.findByIngredients.mockReturnValueOnce(Promise.resolve([
      { id: 1, name: "ham", emissionCO2eInKgPerUnit: 2.5, unit: "kg", source: "Agrybalise" },
      { id: 2, name: "cheese", emissionCO2eInKgPerUnit: 2.4, unit: "kg", source: "Agrybalise" },
    ]));

    const carbonFootprint = await agrybaliseCarbonFootprintCalculatorService.calculateCarbonFootprintOfIngredients([
      { name: "ham", quantity: 0.1, unit: "kg" },
      { name: "cheese", quantity: 0.15, unit: "kg" },
    ]);

    expect(carbonFootprint).toEqual(0.61);
  });
});
