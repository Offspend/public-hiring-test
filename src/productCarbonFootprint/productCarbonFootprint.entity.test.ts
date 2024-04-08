import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { IngredientsType } from "./event/create-productCarbonFootprint.event";
import { ProductCarbonFootprint } from "./productCarbonFootprint.entity";

let hamAndCheesePizza: ProductCarbonFootprint;

const ingredients: IngredientsType[] = [
  { name: "ham", quantity: 0.1, unit: "kg" },
  { name: "cheese", quantity: 0.15, unit: "kg" },
  { name: "tomato", quantity: 0.4, unit: "kg" },
  { name: "floor", quantity: 0.7, unit: "kg" },
  { name: "oliveOil", quantity: 0.3, unit: "kg" },
];

beforeAll(async () => {
  await dataSource.initialize();
  hamAndCheesePizza = new ProductCarbonFootprint({
    score: 25.1,
    name: "hamAndCheesePizza",
    ingredients,
  });
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});

describe("FoodProductEntity", () => {
  describe("constructor", () => {
    it("should create an emission factor", () => {
      expect(hamAndCheesePizza.name).toBe("hamAndCheesePizza");
    });
    it("should create an emission factor without any score", () => {
      expect(() => {
        new ProductCarbonFootprint({
          name: "hamAndCheesePizza",
          ingredients,
        });
      }).not.toThrow(new Error("Name cannot be empty"));
    });

    it("should throw an error if the name is empty", () => {
      expect(() => {
        new ProductCarbonFootprint({
          name: "",
          score: 22.3,
          ingredients,
        });
      }).toThrow();
    });

    it("should throw an error if the ingredients is a string", () => {
      expect(() => {
        new ProductCarbonFootprint({
          name: "hamAndCheesePizza",
          score: 22.3,
          ingredients: JSON.parse('"string"'),
        });
      }).toThrow(new Error("Ingredients can not be empty"));
    });

    it("should throw an error if the ingredients is empty", () => {
      expect(() => {
        new ProductCarbonFootprint({
          name: "hamAndCheesePizza",
          score: 22.3,
          ingredients: JSON.parse('""'),
        });
      }).toThrow(new Error("Ingredients can not be empty"));
    });

    it("should throw an error if the ingredients list is empty", () => {
      expect(() => {
        new ProductCarbonFootprint({
          name: "hamAndCheesePizza",
          score: 22.3,
          ingredients: JSON.parse("[]"),
        });
      }).toThrow(new Error("Ingredients can not be empty"));
    });

    it("should throw an error if the ingredients list has no ingredients", () => {
      expect(() => {
        new ProductCarbonFootprint({
          name: "hamAndCheesePizza",
          score: 22.3,
          ingredients: JSON.parse("[{}]"),
        });
      }).toThrow(new Error("Ingredients can not be empty"));
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
