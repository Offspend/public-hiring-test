import { ApiProperty } from '@nestjs/swagger';

import { CreateFoodProductItem } from './shared/create-foodProductItem.dto';

export class CreateFoodProductDto {
  @ApiProperty({ type: [CreateFoodProductItem] })
    items: CreateFoodProductItem[];
}
