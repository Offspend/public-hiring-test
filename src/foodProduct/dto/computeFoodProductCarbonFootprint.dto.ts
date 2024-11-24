import { ApiProperty } from '@nestjs/swagger';

import { Recipe } from './shared/foodProductRecipe.dto';

export class ComputeFoodProductCarbonFootprintDto {
  @ApiProperty()
    recipe: Recipe;
}
