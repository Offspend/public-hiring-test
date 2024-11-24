import { ApiProperty } from '@nestjs/swagger';

import { IngredientItem } from './ingredientItem.dto';

export class Recipe {
  @ApiProperty({ type: [IngredientItem] })
    ingredients: IngredientItem[];
}
