import { FoodProduct } from "./FoodProduct";
import { Ingredient } from "./Ingredient";

describe("FoodProduct", () => {
  describe("findIngredient", () => {
    const pizza = new FoodProduct("pizza", [
      new Ingredient("ham", 1),
      new Ingredient("cheese", 1),
    ]);

    describe("given the ingredient exists", () => {
      it("should return the ingredient", () => {
        const ingredient = pizza.findIngredient("cheese");

        expect(ingredient).toEqual({ name: "cheese", quantity: 1, unit: "kg" });
      });
    });

    describe("given the ingredient does not exist", () => {
      it("should throw an error when the ingredient does not exist", () => {
        expect(() => {
          return pizza.findIngredient("parmesan");
        }).toThrowError();
      });
    });
  });
});
