import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { FoodProduct } from "./foodProduct.entity";

let hamPizzaFoodProductComputed: FoodProduct;
let hamPizzaFoodProductNotComputed: FoodProduct;
beforeAll(async () => {
  await dataSource.initialize();
  hamPizzaFoodProductComputed = new FoodProduct({
    name: 'Ham Pizza',
    recipe: {
      ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "floor", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
      ],
    },
    carbonFootprint: 50, /// This value is not the real computation
  });
  hamPizzaFoodProductNotComputed = new FoodProduct({
    name: 'Ham Pizza',
    recipe: {
      ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "floor", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
      ],
    },
    carbonFootprint: null,
  });
});
beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});
describe("FoodProductEntity", () => {
  describe("constructor", () => {
    it("should create an food product", () => {
      expect(hamPizzaFoodProductComputed.name).toBe("Ham Pizza");
      expect(hamPizzaFoodProductNotComputed.name).toBe("Ham Pizza");
    });
    it("should throw an error if the ingredients is empty", () => {
      expect(() => {
        new FoodProduct({
          name: 'Test',
          recipe: {
            ingredients: [],
          },
          carbonFootprint: null,
        });
      }).toThrow();
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
