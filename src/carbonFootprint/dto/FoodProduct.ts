class IngredientDto {
  name: string;
  quantity: number;
  unit: "kg";
}

export class FoodProductDto {
  name: string;
  ingredients: IngredientDto[];
}
