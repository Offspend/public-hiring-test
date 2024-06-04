import {CarbonFootprintCalculation} from "./carbonFootprintCalculation.entity";

let pizzaFootprintCalculation: CarbonFootprintCalculation;

beforeAll(async () => {
  pizzaFootprintCalculation = new CarbonFootprintCalculation({
    carbonFootprint: 2.4,
    foodProductName: "hamCheesePizza",
    ingredients: [
      { name: "ham", quantity: 0.1, unit: "kg" },
      { name: "cheese", quantity: 0.15, unit: "kg" },
      { name: "tomato", quantity: 0.4, unit: "kg" },
      { name: "floor", quantity: 0.7, unit: "kg" },
      { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
  });
});

describe("FootprintCalculationEntity", () => {
  describe("constructor", () => {
    it("should create a footprint", () => {
      expect(pizzaFootprintCalculation.foodProductName).toBe("hamCheesePizza");
    });

    it("should throw an error if the food product name is empty", () => {
      expect(() => {
        new CarbonFootprintCalculation({
            carbonFootprint: 2.4,
            foodProductName: "",
            ingredients: [],
        });
      }).toThrow();
    });
  });
});
