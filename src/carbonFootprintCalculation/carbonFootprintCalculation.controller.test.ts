import { CarbonFootprintCalculationService } from "./carbonFootprintCalculation.service";
import { CarbonFootprintCalculationController } from "./carbonFootprintCalculation.controller";

let carbonFootprintCalculationController: CarbonFootprintCalculationController;
const mockCarbonFootprintCalculationService = {
  findAll: jest.fn(),
  findByFoodProductName: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

beforeAll(async () => {
  carbonFootprintCalculationController = new CarbonFootprintCalculationController(
      mockCarbonFootprintCalculationService as unknown as CarbonFootprintCalculationService,
  );
});

beforeEach(async () => {
  jest.clearAllMocks();
});

describe("CarbonFootprintCalculationController.get", () => {
  it("should retrieve all footprint calculations", async () => {
    mockCarbonFootprintCalculationService.findAll.mockReturnValueOnce(Promise.resolve([{
        id: 1,
        foodProductName: "hamCheesePizza",
        carbonFootprint: 0.5,
    }]));

    const footprintCalculations = await carbonFootprintCalculationController.getAllCarbonFootprintCalculations();
    expect(footprintCalculations).toHaveLength(1);
  });
});

describe("CarbonFootprintCalculationController.get_filter", () => {
  it("should return a null value if the calculation doesn't exists", async () => {
    mockCarbonFootprintCalculationService.findByFoodProductName.mockReturnValueOnce(Promise.resolve(null));

    const footprintCalculation = await carbonFootprintCalculationController.getOneCarbonFootprintCalculationByFoodProductName(
        { foodProductName: "funkyPizza" }
    );
    expect(footprintCalculation).toBeNull();
  });

  it("should retrieve one footprint calculation", async () => {
    mockCarbonFootprintCalculationService.findByFoodProductName.mockReturnValueOnce(Promise.resolve({
      id: 1,
      foodProductName: "hamCheesePizza",
      carbonFootprint: 0.5,
    }));

    const footprintCalculation = await carbonFootprintCalculationController.getOneCarbonFootprintCalculationByFoodProductName(
        { foodProductName: "hamCheesePizza" }
    );
    expect(footprintCalculation?.foodProductName).toEqual("hamCheesePizza");
  });
});

describe("CarbonFootprintCalculationController.get_id", () => {
  it("should return a null value if the calculation doesn't exists", async () => {
    mockCarbonFootprintCalculationService.findById.mockReturnValueOnce(Promise.resolve(null));

    const footprintCalculations = await carbonFootprintCalculationController.getOneCarbonFootprintCalculationByID(1);
    expect(footprintCalculations).toBeNull();
  });

  it("should retrieve one footprint calculation", async () => {
    mockCarbonFootprintCalculationService.findById.mockReturnValueOnce(Promise.resolve({
      id: 1,
      foodProductName: "hamCheesePizza",
      carbonFootprint: 0.5,
    }));

    const footprintCalculation = await carbonFootprintCalculationController.getOneCarbonFootprintCalculationByID(1);
    expect(footprintCalculation?.foodProductName).toEqual("hamCheesePizza");
  });
});

describe("CarbonFootprintCalculationController.create", () => {
  it("should create a calculation", async () => {
    mockCarbonFootprintCalculationService.create.mockReturnValueOnce(Promise.resolve({
      id: 1,
      foodProductName: "cheesePizza",
      carbonFootprint: 0.5,
    }));

    const footprintCalculation = await carbonFootprintCalculationController.createOneCarbonFootprintCalculation({
        foodProductName: "cheesePizza",
        ingredients: [
            { name: "tomato", quantity: 0.1, unit: "kg" },
            { name: "cheese", quantity: 0.2, unit: "kg" },
        ],
    });
    expect(footprintCalculation.foodProductName).toEqual("cheesePizza");
    expect(footprintCalculation.carbonFootprint).toEqual(0.5);
  });
});
