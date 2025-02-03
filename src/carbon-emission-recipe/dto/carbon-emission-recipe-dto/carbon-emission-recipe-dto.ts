export class CarbonEmissionRecipeDto {
    ingredients: CarbonEmissionIngredientDto[];
}

export class CarbonEmissionIngredientDto {
    name: string;
    quantity: number;
    unit: string;
}
