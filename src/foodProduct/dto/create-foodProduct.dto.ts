import {ApiProperty} from "@nestjs/swagger";
import {Recipe} from "./shared/foodProductRecipe.dto";

class CreateFoodProductItem {
  @ApiProperty()
  name: string;

  @ApiProperty()
  recipe: Recipe;
}

export class CreateFoodProductDto {
  @ApiProperty({ type: [CreateFoodProductItem] })
  items: CreateFoodProductItem[];
}
