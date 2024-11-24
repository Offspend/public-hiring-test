import {ApiProperty} from "@nestjs/swagger";

class IngredientItem {
  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: string;
}

export class Recipe {
  @ApiProperty({ type: [IngredientItem] })
  ingredients: IngredientItem[];
}
