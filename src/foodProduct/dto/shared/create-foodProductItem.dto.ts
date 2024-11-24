import { ApiProperty } from '@nestjs/swagger';

import { Recipe } from './foodProductRecipe.dto';

export class CreateFoodProductItem {
  @ApiProperty()
    name: string;

  @ApiProperty()
    recipe: Recipe;
}
