export class CreateFoodProductDto {
  name: string;
  recipe: {
    ingredients: {
      name: string;
      quantity: number;
      unit: string;
    }[]
  };
}
