import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CalculatedCarbonFootprint } from "./calculatedCarbonFootprint.entity";

let calculatedCarbonFootprint: CalculatedCarbonFootprint;

beforeAll(async () => {
  await dataSource.initialize();
  calculatedCarbonFootprint = new CalculatedCarbonFootprint({recipe: "Ham Cheese Pizza", totalCarbonFootprint:0.224});
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});

describe("CarbonFootprintEntity", () => {
  describe("constructor", () => {
    it("should create a Carbon Footprint", () => {
      expect(calculatedCarbonFootprint.recipe).toBe("Ham Cheese Pizza");
      expect(calculatedCarbonFootprint.totalCarbonFootprint).toBe(0.224);
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});