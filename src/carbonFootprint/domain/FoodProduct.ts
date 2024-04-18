import { Ingredient } from "./Ingredient";

class IngredientNotFoundError extends Error {
  constructor(public readonly name: string) {
    super(`Ingredient not found: "${name}"`);
  }
}

export class FoodProduct {
  constructor(
    public readonly name: string,
    public readonly ingredients: Ingredient[],
  ) {}

  findIngredient(name: string) {
    const ingredient = this.ingredients.find(
      (ingredient) => ingredient.name === name,
    );

    if (!ingredient) {
      throw new IngredientNotFoundError(name);
    }
    return ingredient;
  }
}
